<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class DocumentUpdateRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'remark' => ['nullable', 'string'],
            'created_by' => ['required'],
            'updated_by' => ['nullable'],
        ];
    }
}
