<?php

namespace App\Http\Controllers\Audit;

use App\Http\Controllers\Controller;
use App\Http\Resources\Audit\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::query()
            ->with('user')
            ->when($request->q, function ($query, $q): void {
                $query->where('action', 'LIKE', "%{$q}%");
            })
            ->latest()
            ->paginate();

        return inertia('Admin/Logs/Index', [
            'logs' => $logs->toResourceCollection(AuditLogResource::class),
        ]);
    }

    public function show(Request $request, AuditLog $log)
    {
        $log->load('user');

        return inertia('Admin/Logs/Show', [
            'log' => (new AuditLogResource($log))->resolve($request),
        ]);
    }
}
