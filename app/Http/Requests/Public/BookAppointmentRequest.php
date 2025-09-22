<?php

namespace App\Http\Requests\Public;

use App\Models\PostalCode;
use App\Models\UserPostalCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class BookAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only authenticated users can submit an appointment request
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
   public function rules(): array
    {
        return [
            'service_id' => ['required', 'exists:services,id'],
            'slot_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i:s'],
            
            'participants' => ['required', 'array', 'min:1'], 
            'participants.*.full_name' => ['required', 'string', 'max:255'],
            'participants.*.relation' => ['nullable', 'string', 'max:100'],
            'participants.*.identification_number' => ['required', 'string', 'max:50'], // Added for professional data collection
            'notes' => ['nullable', 'string', 'max:1000'], // Added for completeness
        ];
    }
    

    
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }
                
                // 1. Check User's Postal Code Restriction (Day 6 Rule)
                $this->validatePostalCode($validator);

                // NOTE: Appointment Limit checks are now in the BookingService to fail immediately before the transaction.
            },
        ];
    }

    private function validatePostalCode(Validator $validator): void
    {
        /** @var \App\Models\User $user */
        $user = $this->user();
        
        $userPostalCode = $user->userPostalCode;

        if (!$userPostalCode) {
            $validator->errors()->add('profile', 'Please save your postal address in the profile settings before booking.');
            return;
        }

        $isPermitted = PostalCode::where('code', $userPostalCode->code) 
                                 ->where('is_permitted', true)
                                 ->exists();

        if (!$isPermitted) {
            // Use the exact message required by the SRS
            $message = 'We apologize, but our services are currently only available within specific areas. Your postal code is not within our current coverage zone.';
            $validator->errors()->add('postal_code', $message);
        }
    }
}