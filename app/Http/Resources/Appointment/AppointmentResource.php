<?php

namespace App\Http\Resources\Appointment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'service_id' => $this->service_id,
            'service'   => $this->service,
            'booked_by_user_id' => $this->booked_by_user_id,
            'registar_user_id' => $this->registar_user_id,
            'type' => $this->type,
            'status' => $this->status,
            'scheduled_date' => $this->scheduled_date ? Carbon::parse($this->scheduled_date)->format('Y-m-d') : null,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'postal_address' => $this->postal_address,
            'notes' => $this->notes,
            'canceled_at' => $this->canceled_at,
            'canceled_by' => $this->canceled_by,
        ];
    }
}
