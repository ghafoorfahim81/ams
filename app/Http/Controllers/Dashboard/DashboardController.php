<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Appointment\Appointment;
use App\Models\Service\Service;
use App\Models\User;
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
        $dateFrom = $filter ?: now()->toDateString();

        $totalUsers = User::query()->count();
        $totalServices = Service::query()->count();
        $totalAppointments = Appointment::query()
            ->when($dateFrom, fn($q) => $q->whereDate('scheduled_date', '>=', $dateFrom))
            ->count();

        $appointmentsByStatus = Appointment::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->when($dateFrom, fn($q) => $q->whereDate('scheduled_date', '>=', $dateFrom))
            ->groupBy('status')
            ->get()
            ->map(fn($row) => [
                'name' => (string) ($row->status ?? 'unknown'),
                'value' => (int) $row->total,
            ]);

        $appointmentsByType = Appointment::query()
            ->select('type', DB::raw('COUNT(*) as total'))
            ->when($dateFrom, fn($q) => $q->whereDate('scheduled_date', '>=', $dateFrom))
            ->groupBy('type')
            ->get()
            ->map(fn($row) => [
                'name' => (string) ($row->type ?? 'unknown'),
                'value' => (int) $row->total,
            ]);

        $servicesWithCounts = Appointment::query()
            ->select('service_id', DB::raw('COUNT(*) as total'))
            ->with('service:id,name')
            ->when($dateFrom, fn($q) => $q->whereDate('scheduled_date', '>=', $dateFrom))
            ->groupBy('service_id')
            ->orderByDesc('total')
            ->limit(12)
            ->get()
            ->map(fn($row) => [
                'name' => optional($row->service)->name ?? 'Unknown',
                'total' => (int) $row->total,
            ]);

        return response()->json([
            'totals' => [
                'users' => $totalUsers,
                'services' => $totalServices,
                'appointments' => $totalAppointments,
            ],
            'appointmentsByStatus' => $appointmentsByStatus,
            'appointmentsByType' => $appointmentsByType,
            'servicesWithCounts' => $servicesWithCounts,
        ]);
    }
}
