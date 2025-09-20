<?php

namespace App\Http\Resources\Document;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $isIndex = $request->routeIs('documents.index');

        return [
            'id' => $this->id,
            'title' => $isIndex ? Str::limit($this->title, 20, '...') : $this->title,
            'action' => $this->action?->toResource(),
            'remark' => $this->remark,
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d') : null,
            'created_by' => $this->createdBy,
            'updated_by' => $this->updated_by,
            'trackers' => $this->trackers->toResourceCollection(),
            'latest_tracker' => $this->whenLoaded('latestTracker', fn() => $this->latestTracker->toResource()),
            'oldest_tracker' => $this->whenLoaded('oldestTracker', fn() => $this->oldestTracker->toResource()),
            'row_highlight_class' => $this->getRowHighlightClass(),
        ];
    }

    /**
     * Calculate row highlighting class based on tracker deadline
     */
    private function getRowHighlightClass(): ?string
    {
        // Only apply highlighting if latest tracker status is not completed


        if ($this->latestTracker->status->value === 'completed') {
            return null;
        }

        // Get the first tracker (oldest)
        $firstTracker = $this->oldestTracker;
        $bgColor = null;
        // Calculate days difference between today and first tracker's created_at
        if ($this->latestTracker->status->value != 'completed') {


            $today = Carbon::now();
            $firstTrackerCreatedAt = Carbon::parse($firstTracker->created_at);

            $firstTrackerCreatedAt = $firstTracker->created_at instanceof Carbon
                ? $firstTracker->created_at
                : Carbon::parse($firstTracker->getRawOriginal('created_at'));


            $daysSinceCreation = $firstTrackerCreatedAt->diffInDays($today);


            // Apply highlighting rules
            if ($daysSinceCreation == $firstTracker->request_deadline) {
                $bgColor = 'bg-red-300';
            } elseif ($daysSinceCreation < $firstTracker->request_deadline && $daysSinceCreation >= ($firstTracker->request_deadline - 1)) {
                $bgColor = 'bg-red-200';
            } elseif ($daysSinceCreation > $firstTracker->request_deadline) {
                $bgColor = 'bg-red-500';
            }
        }

        return $bgColor;
    }
}
