<?php

namespace App\Http\Requests\Admin\Service;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Placeholder authorization: assumes any logged-in user can access Admin CRUD for now
        // This will be replaced by a proper role check later (e.g., $this->user()->isAdmin())
        return $this->user() !== null; 
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:services,name'],
            'description' => ['nullable', 'string'],
            'duration' => ['required', 'integer', 'min:5'], // Duration in minutes
            'capacity' => ['required', 'integer', 'min:1'], // Max participants per slot
            'is_active' => ['boolean'],
        ];
    }
}