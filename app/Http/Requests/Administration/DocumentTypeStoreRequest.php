<?php

namespace App\Http\Requests\Administration;

use Illuminate\Foundation\Http\FormRequest;

class DocumentTypeStoreRequest extends FormRequest
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
            'name_fa' => ['required', 'string', 'max:256', 'unique:document_types,name_fa'],
            'name_ps' => ['required', 'string', 'max:256', 'unique:document_types,name_ps'],
            'name_en' => ['required', 'string', 'max:256', 'unique:document_types,name_en'],
            'slug' => ['nullable', 'string', 'unique:document_types,slug'],
        ];
    }
}
