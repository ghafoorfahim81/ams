<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DocumentOverdue implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public $document, public $tracker = null, public $user = null) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    //    public function broadcastOn(): array
    //    {
    //        return[
    //            new PrivateChannel("document-overdue. {$this->user->id}")];
    //    }
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("document-overdue.{$this->user->id}"),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id' => \Illuminate\Support\Str::uuid(), // Generate a unique ID for the event
            'document_id' => $this->document->id,
            'user_id' => $this->user->id,
            'title' => $this->document->title,
            'message' => ' is overdue by '.now()->diffInDays($this->document->getRawOriginal('created_at')) - $this->tracker->request_deadline,
            'created_at' => now()->toDateTimeString(),
        ];
    }
}
