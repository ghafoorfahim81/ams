<?php

namespace App\Http\Requests\Document;

use Illuminate\Foundation\Http\FormRequest;

class TrackerStoreRequest extends FormRequest
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
            'sender_directorate_id' => ['nullable', 'integer', 'exists:directorates,id'],
            'receiver_user_id' => ['required', 'integer', 'exists:users,id'],
            'status' => ['required', 'in:pending,ongoing,completed,rejected'],
            'document_type_id' => ['required', 'integer', 'exists:document_types,id'],
            'in_num' => ['nullable', 'string'],
            'in_date' => ['nullable', 'date'],
            'out_num' => ['nullable', 'string'],
            'out_date' => ['nullable', 'date'],
            'type' => ['required', 'in:internal,external'],
            'inout_flag' => ['required_if:type,external', 'sometimes'],
            'request_deadline' => ['required', 'integer'],
            'focal_point_name' => ['nullable', 'string'],
            'focal_point_phone' => ['nullable', 'string'],
            'conclusion' => ['nullable', 'string'],
            'actions' => ['nullable', 'string'],
            'security_level_id' => ['required', 'integer', 'exists:security_levels,id'],
            'followup_type' => ['required', 'in:actions,respond,followup'],
            'attachment_file' => ['nullable', 'file', 'mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg', 'max:5140'],
        ];
    }
}
