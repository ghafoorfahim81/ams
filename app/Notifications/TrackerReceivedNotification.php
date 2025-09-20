<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Laravel\Reverb\Protocols\Pusher\Channels\PrivateChannel;

class TrackerReceivedNotification extends Notification
{
    use Queueable;

    public function __construct(
        /**
         * Create a new notification instance.
         */
        protected $document,
        protected $tracker
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'document_id' => $this->document->id,
            'title' => $this->tracker->document->title,
            'message' => 'Sent to you',
            'user_id' => $this->tracker->receiver_user_id,
            'created_at' => now()->toDateTimeString(),
        ];
    }

    public function toBroadcast($notifiable): \Illuminate\Notifications\Messages\BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => \Illuminate\Support\Str::uuid(),
            'message' => "{$this->tracker->document->title}'Sent to you",
            'created_at' => now()->toDateTimeString(),
        ]);
    }

    public function broadcastOn()
    {
        return [
            new PrivateChannel('receive-tracker.'.$this->tracker->receiver_user_id),
        ];
    }
}
