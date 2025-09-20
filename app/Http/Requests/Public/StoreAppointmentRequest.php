<?php

namespace App\Http\Requests\Public;

use App\Models\PostalCode;
use App\Models\UserPostalCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreAppointmentRequest extends FormRequest
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
            
            // Validate the participant list (must have at least one)
            'participants' => ['required', 'array', 'min:1'], 
            'participants.*.full_name' => ['required', 'string', 'max:255'],
            'participants.*.relation' => ['nullable', 'string', 'max:100'],
        ];
    }

    
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return; // Skip complex checks if basic validation failed
                }
                
                // 1. Check User's Postal Code Restriction (Day 6 Rule)
                $this->validatePostalCode($validator);
                
                // 2. Check Slot Availability (Slot and Time validation)
                // NOTE: Detailed availability, capacity decrement, and holiday checks 
                // are best done in a **dedicated Booking Service Class** within a transaction
                // to prevent race conditions during the final booking submission.
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

        $isPermitted = PostalCode::where('code', $userPostalCode->postal_code)
                                 ->where('is_permitted', true)
                                 ->exists();

        if (!$isPermitted) {
            $message = 'Your postal code is not within our current service coverage zone.';
            $validator->errors()->add('postal_code', $message);
        }
    }
}