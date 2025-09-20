<?php

namespace App\Http\Resources\Document;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'document_id' => $this->document_id,
            'sender_directorate' => (function () {
                if ($this->type === \App\Enums\Type::External && $this->inout_flag === 'in') {
                    return [
                        'id' => $this->externalOrganizationSender?->id,
                        'name' => $this->externalOrganizationSender?->name,
                    ];
                }

                return [
                    'id' => $this->senderDirectorate?->id,
                    'name' => $this->senderDirectorate?->name_fa,
                ];
            })(),

            'receiver_user' => [
                'id' => $this->receiverUser?->id,
                'user_name' => $this->receiverUser?->user_name,
                'email' => $this->receiverUser?->email,
                'directorate' => $this->receiverUser?->directorate()->toResource(),
            ],
            'status' => $this->status,
            'status_label' => $this->status->getLabel(),
            'document_type' => $this->documentType->toResource(),
            'in_num' => $this->in_num,
            'in_date' => $this->in_date?->format('Y-m-d'),
            'out_num' => $this->out_num,
            'out_date' => $this->out_date?->format('Y-m-d'),
            'type' => $this->type,
            'type_label' => $this->type->getLabel(),
            'inout_flag' => $this->inout_flag,
            'request_deadline' => $this->request_deadline,
            'focal_point_name' => $this->focal_point_name,
            'focal_point_phone' => $this->focal_point_phone,
            'conclusion' => $this->conclusion,
            'actions' => $this->actions,
            'security_level' => $this->securityLevel->toResource(),
            'followup_type' => $this->followup_type,
            'followup_type_label' => $this->followup_type->getLabel(),
            'created_by' => [
                'id' => $this->createdBy?->id,
                'user_name' => $this->createdBy?->user_name,
                'email' => $this->createdBy?->email,
                'directorate' => $this->createdBy?->directorate()->toResource(),
            ],
            'updated_by' => [
                'id' => $this->updatedBy?->id,
                'user_name' => $this->updatedBy?->user_name,
                'email' => $this->updatedBy?->email,
                'directorate' => $this->updatedBy?->directorate()->toResource(),
            ],
            'comments' => $this->comments->map(fn($comment): array => [
                'id' => $comment->id,
                'user' => $comment->user,
                'parent' => $comment->parent,
                'body' => $comment->body,
                'created_at' => $comment->created_at->format('Y-m-d'),
            ]),
            'attachments' => $this->attachments->map(fn($attachment): array => [
                'id' => $attachment->id,
                'path' => $attachment->path,
            ]),
        ];
    }
}
