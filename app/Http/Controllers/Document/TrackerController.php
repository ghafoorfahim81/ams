<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\TrackerStoreRequest;
use App\Http\Requests\Document\TrackerUpdateRequest;
use App\Models\Document\Comment;
use App\Models\Document\Tracker;
use App\Services\FileHandler;
use Illuminate\Http\Request;
use App\Notifications\TrackerReceivedNotification;
use Illuminate\Support\Facades\Notification;
use App\Events\ReceiveTracker;
use App\Models\User;
class TrackerController extends Controller
{
    public function index(Request $request): void
    {
        Tracker::all();

        // return new TrackerCollection($trackers);
    }

    public function store(TrackerStoreRequest $request, FileHandler $fileHandler)
    {
        $validated = $request->validated();
        $validated['sender_directorate_id'] ??= auth()->user()->employee->directorate_id;

        $tracker = Tracker::create($validated);

        $document = $tracker->document;
        if ($tracker->receiver_user_id) {
                $user = User::find($tracker->receiver_user_id);
                $user->notify(new TrackerReceivedNotification($document, $tracker));
                broadcast(new \App\Events\ReceiveTracker($document, $tracker, $user));
            }
        if ($request->has('attachment_file')) {
            $fileName = $fileHandler->upload($request->file('attachment_file'), 'attachments');
            $tracker->attachments()->create([
                // generate a unique file name
                'path' => $fileName,
            ]);
        }

        return back();
    }

    public function show(Tracker $tracker): void
    {
        // return new EmployeeResource($tracker);
    }

    public function update(TrackerUpdateRequest $request, Tracker $tracker, FileHandler $fileHandler)
    {
        $validated = $request->validated();
        $validated['sender_user_id'] = auth()->id();

        $tracker->update($validated);

        if ($request->has('attachment_file')) {
            $fileName = $fileHandler->upload($request->file('attachment_file'), 'attachments');
            $tracker->attachments()->delete();
            $tracker->attachments()->create([
                'path' => $fileName,
            ]);
        }

        return to_route('documents.show', $tracker->document_id);
    }

    public function destroy(Tracker $tracker)
    {
        $tracker->delete();

        return back();
    }

    public function storeComment(Request $request, Tracker $tracker)
    {
        $validated = $request->validate([
            'comment' => ['min:3', 'string'],
        ]);

        $tracker->comments()->create([
            'user_id' => auth()->id(),
            'body' => $validated['comment'],
        ]);

        return back();
    }

    public function updateComment(Request $request, Comment $comment)
    {
        abort_if($comment->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'body' => ['required', 'min:3', 'string'],
        ]);

        $comment->update([
            'body' => $validated['body'],
        ]);

        return back();
    }

    public function deleteComment(Tracker $tracker, Comment $comment)
    {
        abort_if($comment->user_id !== auth()->id(), 403);

        $comment->delete();

        return back();
    }
}
