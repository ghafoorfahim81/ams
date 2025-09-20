<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AddActions implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        /**
         * Create a new event instance.
         */
        public $document,
        public $user = null,
        public $createdBy = null
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('add-actions.'.$this->user->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'document_id' => $this->document->id,
            'title' => $this->document->title,
            'message' => 'Actions added on',
            'user_id' => $this->document->created_by,
            'added_by' => User::find($this->createdBy)->user_name,
            'created_at' => now()->toDateTimeString(),
        ];
    }
}
