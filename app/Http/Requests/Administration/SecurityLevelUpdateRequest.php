<?php

namespace App\Http\Requests\Administration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SecurityLevelUpdateRequest extends FormRequest
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
            'name_fa' => ['required', 'string', 'max:256', Rule::unique('security_levels')->ignore($this->route('security-level'))],
            'name_ps' => ['required', 'string', 'max:256', Rule::unique('security_levels')->ignore($this->route('security-level'))],
            'name_en' => ['required', 'string', 'max:256', Rule::unique('security_levels')->ignore($this->route('security-level'))],
        ];
    }
}
