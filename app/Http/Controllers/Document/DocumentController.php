<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\DocumentStoreRequest;
use App\Http\Requests\Document\DocumentUpdateRequest;
use App\Models\Document\Document;
use App\Models\User;
use App\Notifications\TrackerReceivedNotification;
use App\Services\FileHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Document\Tracker;
use Illuminate\Support\Facades\Notification;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        // Check if any tracker-related filters are applied
        $trackerFilters = [
            'sender_directorate_id',
            'receiver_directorate_id',
            'status',
            'out_date',
            'in_date',
            'type',
            'security_level_id',
            'out_num',
            'in_num',
            'document_type_id'
        ];
        
        $hasTrackerFilters = collect($trackerFilters)->some(function ($filter) use ($request) {
            return $request->filled($filter);
        });

        // Start with base query
        $query = Document::with(['latestTracker', 'oldestTracker'])
            ->search($request->query('q'))
            ->sort($request->sort_by);

        // Apply document-level filters (always available)
        if ($request->filled('title')) {
            $query->where('documents.title', 'like', '%' . $request->title . '%');
        }

        // Only perform complex joins if tracker-related filters are applied
        if ($hasTrackerFilters) {
            // Get the first tracker for each document using a subquery
            $firstTrackerSubquery = DB::table('trackers as t1')
                ->select('t1.document_id', 't1.id as first_tracker_id')
                ->whereRaw('t1.id = (SELECT MIN(id) FROM trackers WHERE document_id = t1.document_id)');

            $query->leftJoinSub($firstTrackerSubquery, 'first_trackers', function ($join) {
                $join->on('documents.id', '=', 'first_trackers.document_id');
            })
                ->leftJoin('trackers as first_tracker', 'first_trackers.first_tracker_id', '=', 'first_tracker.id')
                ->leftJoin('directorates as sender_dir', 'first_tracker.sender_directorate_id', '=', 'sender_dir.id')
                ->leftJoin('users as receiver_user', 'first_tracker.receiver_user_id', '=', 'receiver_user.id')
                ->leftJoin('employees as receiver_emp', 'receiver_user.employee_id', '=', 'receiver_emp.id')
                ->leftJoin('directorates as receiver_dir', 'receiver_emp.directorate_id', '=', 'receiver_dir.id')
                ->leftJoin('document_types', 'first_tracker.document_type_id', '=', 'document_types.id')
                ->leftJoin('security_levels', 'first_tracker.security_level_id', '=', 'security_levels.id')
                ->select('documents.*');

            // Apply tracker-related filters
            if ($request->filled('sender_directorate_id')) {
                $query->where('first_tracker.sender_directorate_id', $request->sender_directorate_id);
            }

            if ($request->filled('receiver_directorate_id')) {
                $query->where('receiver_dir.id', $request->receiver_directorate_id);
            }

            if ($request->filled('status')) {
                $query->where('first_tracker.status', $request->status);
            }

            if ($request->filled('out_date')) {
                $query->whereDate('first_tracker.out_date', $request->out_date);
            }

            if ($request->filled('in_date')) {
                $query->whereDate('first_tracker.in_date', $request->in_date);
            }

            if ($request->filled('type')) {
                $query->where('first_tracker.type', $request->type);
            }

            if ($request->filled('security_level_id')) {
                $query->where('first_tracker.security_level_id', $request->security_level_id);
            }

            if ($request->filled('out_num')) {
                $query->where('first_tracker.out_num', 'like', '%' . $request->out_num . '%');
            }

            if ($request->filled('in_num')) {
                $query->where('first_tracker.in_num', 'like', '%' . $request->in_num . '%');
            }

            if ($request->filled('document_type_id')) {
                $query->where('first_tracker.document_type_id', $request->document_type_id);
            }
        } else {
            // For non-tracker filters, we still need to handle status filters using the latest tracker relation
            if ($request->filled('status')) {
                $query->whereRelation('latestTracker', 'status', $request->status);
            }
        }

        $documents = $query->paginate();

        return inertia('Documents/Index', [
            'documents' => $documents->toResourceCollection(),
        ]);
    }

    public function create()
    {
        return inertia('Documents/Create');
    }

    public function store(DocumentStoreRequest $request, FileHandler $fileHandler)
    {

        $validated = $request->validated();
        $documentData = [
            'title' => $validated['title'],
            'remark' => $validated['remark'] ?? null,
        ];

        // Prepare tracker data
        $sender_directorate_id = $validated['sender_directorate_id'] ?? auth()->user()->employee->directorate_id;

        if ($request->external_organization_id && $request->inout_flag === 'in') {
            $sender_directorate_id = $request->external_organization_id;
        }

        $trackerData = [
            'sender_directorate_id' => $sender_directorate_id,
            'receiver_user_id' => $validated['receiver_user_id'] ?? null,
            'status' => $validated['status'],
            'document_type_id' => $validated['document_type_id'],
            'in_num' => $validated['in_num'] ?? null,
            'in_date' => $validated['in_date'] ?? null,
            'out_num' => $validated['out_num'] ?? null,
            'out_date' => $validated['out_date'] ?? null,
            'type' => $validated['type'] ?? null,
            'inout_flag' => $validated['inout_flag'] ?? null,
            'request_deadline' => $validated['request_deadline'] ?? null,
            'focal_point_name' => $validated['focal_point_name'] ?? null,
            'focal_point_phone' => $validated['focal_point_phone'] ?? null,
            'conclusion' => $validated['conclusion'] ?? null,
            'actions' => $validated['actions'] ?? null,
            'security_level_id' => $validated['security_level_id'],
            'followup_type' => $validated['followup_type'] ?? null,

        ];
        DB::transaction(function () use ($documentData, $trackerData, $fileHandler, $request): void {
            $document = Document::create($documentData);

            $tracker = $document->trackers()->create($trackerData);
            if ($tracker->receiver_user_id) {
                $user = User::find($tracker->receiver_user_id);
                $user->notify(new TrackerReceivedNotification($document, $tracker));
                broadcast(new \App\Events\ReceiveTracker($document, $tracker, $user));
            }

            if ($request->hasFile('attachment_file')) {
                $fileName = $fileHandler->upload($request->file('attachment_file'), 'attachments');
                $tracker->attachments()->create([
                    'path' => $fileName,
                ]);
            }
        });

        return to_route('documents.index');
    }

    public function show(Document $document)
    {
        $document->load([
            'action',
            'trackers.comments',
            'trackers.attachments',
        ]);

        return inertia('Documents/Show', [
            'document' => $document->toResource(),
        ]);
    }

    public function edit(Document $document)
    {
        return inertia('Documents/Edit', [
            'document' => $document->toResource(),
        ]);
    }

    public function update(DocumentUpdateRequest $request, Document $document): \App\Http\Resources\Document\DocumentResource
    {
        $document->update($request->validated());

        return $document->toResource();
    }

    public function destroy(Document $document)
    {
        foreach ($document->trackers()->get() as $tracker) {
            $tracker->attachments()->each(function ($attachment): void {
                $attachment->delete();
            });
        }
        //        $document->trackers()->attachments()->delete();
        $document->trackers()->delete();
        $document->action()->delete();
        $document->delete();

        return redirect()->back();
    }
}
