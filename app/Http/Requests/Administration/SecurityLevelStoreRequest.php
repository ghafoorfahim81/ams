<?php

namespace App\Http\Requests\Administration;

use Illuminate\Foundation\Http\FormRequest;

class SecurityLevelStoreRequest extends FormRequest
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
            'name_fa' => ['required', 'string', 'max:256', 'unique:security_levels,name_fa'],
            'name_ps' => ['required', 'string', 'max:256', 'unique:security_levels,name_ps'],
            'name_en' => ['required', 'string', 'max:256', 'unique:security_levels,name_en'],
        ];
    }
}
