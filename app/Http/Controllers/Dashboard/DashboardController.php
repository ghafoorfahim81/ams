<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Document\Action;
use App\Models\Document\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function dashboard()
    {
        return inertia('Dashboard');
    }

    public function dashboardData(Request $request)
    {
        $filter = $request->query('filter');
        $dateFilter = $filter ?? now()->toDateString();
        $user = auth()->user();
        $userId = $user->id;
        $userDirectorateId = optional($user->employee)->directorate_id;
        $firstTrackers = DB::table('trackers as t1')
            ->select('t1.*')
            ->where('t1.receiver_user_id', $userId)
            ->orWhere('t1.created_by', $userId)
            ->orWhere('t1.sender_directorate_id', $userDirectorateId)
            ->join(DB::raw('(SELECT MIN(id) as id FROM trackers GROUP BY document_id) as first'), 't1.id', '=', 'first.id');

        $results = DB::table(DB::raw("({$firstTrackers->toSql()}) as ft"))
            ->mergeBindings($firstTrackers)
            ->leftJoin('directorates as sender_dir', 'sender_directorate_id', '=', 'sender_dir.id')
            ->leftJoin('users as receiver', 'ft.receiver_user_id', '=', 'receiver.id')
            ->leftJoin('employees as receiver_emp', 'receiver.employee_id', '=', 'receiver_emp.id')
            ->leftJoin('directorates as receiver_dir', 'receiver_emp.directorate_id', '=', 'receiver_dir.id')
            ->select([
                'sender_dir.name_fa as sender_directorate',
                'receiver_dir.name_fa as receiver_directorate',
                DB::raw('COUNT(DISTINCT ft.id) as tracker_count'),
            ])
            ->where('ft.receiver_user_id', $userId)
            ->orWhere('ft.created_by', $userId)
            ->orWhere('ft.sender_directorate_id', $userDirectorateId)
            ->where('ft.created_at', '>=', $dateFilter)
            ->groupBy('sender_dir.name_fa', 'receiver_dir.name_fa')
            ->get();

        $chartData = [];

        foreach ($results as $row) {
            if ($row->sender_directorate) {
                $chartData[$row->sender_directorate]['name'] = $row->sender_directorate;
                $chartData[$row->sender_directorate]['sent'] = ($chartData[$row->sender_directorate]['sent'] ?? 0) + $row->tracker_count;
            }

            if ($row->receiver_directorate) {
                $chartData[$row->receiver_directorate]['name'] = $row->receiver_directorate;
                $chartData[$row->receiver_directorate]['received'] = ($chartData[$row->receiver_directorate]['received'] ?? 0) + $row->tracker_count;
            }
        }

        $chartData = array_values($chartData);
        $document = new Document;
        $allDocuments = Document::where('created_at', '>=', $dateFilter)->count();
        $pendingApproval = Action::whereNull('approved_at')->where('created_at', '>=', $dateFilter)->count();
        $approved = Action::whereNotNull('approved_at')->where('created_at', '>=', $dateFilter)->count();
        $documentsByStatus = DB::table(DB::raw("({$firstTrackers->toSql()}) as ft"))
            ->mergeBindings($firstTrackers)
            ->selectRaw("
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as totalCompleted,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as totalPending,
        SUM(CASE WHEN status = 'Ongoing' THEN 1 ELSE 0 END) as totalOngoing,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as totalRejected
    ")
            ->where('ft.created_at', '>=', $dateFilter)
            ->where('ft.receiver_user_id', $userId)
            ->orWhere('ft.created_by', $userId)
            ->orWhere('ft.sender_directorate_id', $userDirectorateId)
            ->first();

        return response()->json([
            'suggestions' => $document->getDocumentByType('suggestion', $filter)->toArray(),
            'letters' => $document->getDocumentByType('letter', $filter)->toArray(),
            'ahkams' => $document->getDocumentByType('ahkam', $filter)->toArray(),
            'requisitions' => $document->getDocumentByType('requisition', $filter)->toArray(),
            'saderaAndWareda' => $document->getSaderaAndWareda($filter),
            'chartData' => $chartData,
            'allDocuments' => $allDocuments,
            'documentsByStatus' => $documentsByStatus,
            'pendingApproval' => $pendingApproval,
            'approved' => $approved,

        ]);
    }
}
