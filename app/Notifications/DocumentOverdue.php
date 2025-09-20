<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentOverdue extends Notification
{
    use Queueable;

    public function __construct(
        /**
         * Create a new notification instance.
         */
        protected $document,
        protected $tracker,
        protected $user
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('DTSNotification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $createdAt = Carbon::parse($this->document->getRawOriginal('created_at'));
        $daysOverdue = floor($createdAt->diffInDays(Carbon::today()) - $this->tracker->request_deadline);

        return [
            'document_id' => $this->document->id,
            'title' => $this->document->title,
            'user_id' => $this->user->id,
            'message' => "is overdue by {$daysOverdue}",
            'created_at' => now()->toDateTimeString(),
        ];
    }
}
