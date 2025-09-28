<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ServiceCategoryStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'unique:service_categories,name'],
            'slug' => ['nullable', 'string', 'unique:service_categories,slug'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);
        return $validated;
    }
}


