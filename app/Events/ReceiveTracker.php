<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReceiveTracker implements ShouldBroadcastNow
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
        public $tracker = null,
        public $user = null
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("receive-tracker.{$this->user->id}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'document_id' => $this->document->id,
            'title' => $this->document->title,
            'message' => 'Sent to you',
            'user_id' => $this->tracker->receiver_user_id,
            'created_at' => now()->toDateTimeString(),
        ];
    }
}
