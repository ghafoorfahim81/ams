<?php

namespace App\Http\Requests\Administration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserStoreRequest extends FormRequest
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
            'user_name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', Password::min(8)->letters()->numbers()->symbols(), 'confirmed'],
            'employee_id' => ['required', 'exists:employees,id'],
            'avatar' => ['nullable', 'image'],
            'role' => ['required'],
            'permissions' => ['array', 'exists:permissions,name'],
        ];
    }
}
