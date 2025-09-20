<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class ActionStoreRequest extends FormRequest
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
            'document_id' => ['required', 'integer', 'exists:documents,id'],
            'content' => ['nullable', 'string'],
            'approved_by' => ['nullable'],
            'approved_at' => ['nullable', 'date'],
        ];
    }
}
