<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Appointment\AppointmentStoreRequest;
use App\Http\Requests\Appointment\AppointmentUpdateRequest;
use App\Http\Resources\Appointment\AppointmentCollection;
use App\Http\Resources\Appointment\AppointmentResource;
use App\Models\Appointment\Appointment;
use App\Models\Service\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::with('service')->search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Admin/Appointments/Index', [
            'appointments' => $appointments->toResourceCollection(),
        ]);
    }

    public function store(AppointmentStoreRequest $request)
    {
        $appointment = Appointment::create($request->validated());

        return new AppointmentResource($appointment);
    }

    public function show(Request $request, Appointment $appointment)
    {
        $appointment->load(['service', 'participants']);
        return new AppointmentResource($appointment);
    }

    public function edit(Request $request, Appointment $appointment)
    {
        return inertia('Admin/Appointments/Edit', [
            'appointment' => new AppointmentResource($appointment->load('service')),
            'services' => Service::query()
                ->select('id', 'name')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(AppointmentUpdateRequest $request, Appointment $appointment)
    {
        $appointment->update($request->validated());

        return redirect('appointments');
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->back();
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $appointment->update(['status' => 'canceled']);
        return redirect()->back();
    }
}
