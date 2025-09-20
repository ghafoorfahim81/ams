<?php

namespace App\Http\Requests\Administration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExternalOrganizationUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:256', Rule::unique('external_organizations')->ignore($this->route('external-organization'))],

        ];
    }
}
