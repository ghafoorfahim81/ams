<?php

namespace App\Http\Requests\Appointment;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'unique:appointments,code'],
            'service_id' => ['required', 'integer'],
            'booked_by_user_id' => ['required', 'integer'],
            'registar_user_id' => ['nullable', 'integer'],
            'type' => ['required', 'string', 'in:regular,emergency'],
            'status' => ['required', 'string', 'in:pending,rescheduled,canceled,confirmed'],
            'scheduled_date' => ['required'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'postal_address' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'canceled_at' => ['nullable'],
            'canceled_by' => ['nullable', 'integer'],
        ];
    }
}
