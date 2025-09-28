<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @method mixed route(string|null $name = null)
 */
class ServiceCategoryUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', Rule::unique('service_categories', 'name')->ignore($this->route('service_category'))],
            'slug' => ['nullable', 'string', Rule::unique('service_categories', 'slug')->ignore($this->route('service_category'))],
            'description' => ['nullable', 'string'],
        ];
    }
}


