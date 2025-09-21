<?php

namespace App\Http\Requests\PostalCode;

use Illuminate\Foundation\Http\FormRequest;

class PostalCodeUpdateRequest extends FormRequest
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
            'code' => ['required', 'string', 'unique:postal_codes,code,' . $this->route('postal_code')->id],
            'region_name' => ['nullable', 'string'],
            'is_permitted' => ['required'],
        ];
    }
}
