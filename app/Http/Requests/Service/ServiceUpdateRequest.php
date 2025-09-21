<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class ServiceUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', 'unique:services,name,' . $this->route('service')->id],
            'duration' => ['required', 'integer'],
            'capacity_per_slot' => ['required', 'integer'],
            'is_active' => ['required'],
            'description' => ['nullable', 'string'],
            'is_emergency' => ['required'],
        ];
    }
}
