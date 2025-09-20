<?php

namespace App\Console\Commands;

use App\Models\Document\Document;
use App\Models\Scopes\DocumentUserScope;
use App\Models\User;
use App\Notifications\DocumentOverdue;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Notifications\DatabaseNotification;

class CheckDocumentDeadlines extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'document:check-deadlines';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $today = Carbon::today();
        $authenticatedUser = auth()->user();
        $isSuperAdmin = $authenticatedUser?->hasRole('super_admin');
        $documents = Document::with('trackers')
            ->withoutGlobalScope(DocumentUserScope::class)
            ->whereHas('trackers', fn ($query) => $query->whereNotIn('status', ['completed']))
            ->get();

        foreach ($documents as $document) {
            $tracker = $document->trackers->first();
            $createdAt = $document->created_at instanceof Carbon
                ? $document->created_at
                : Carbon::parse($document->getRawOriginal('created_at'));

            $daysSinceCreation = $createdAt->diffInDays($today);

            if ($daysSinceCreation <= $tracker->request_deadline) {
                $this->info("Document ID {$document->id} is not overdue.");
                continue;
            }

            $creator = User::find($document->created_by);
            $receiver = User::find($tracker->receiver_user_id);

            $notifiableIds = collect([
                $creator?->id,
                $receiver?->id,
                $isSuperAdmin ? $authenticatedUser->id : null,
            ])->filter()->unique()->toArray();

            $exists = DatabaseNotification::whereIn('notifiable_id', $notifiableIds)
                ->where('notifiable_type', User::class)
                ->where('type', \App\Notifications\DocumentOverdue::class)
                ->where('data->document_id', $document->id)
                ->exists();

            if ($exists) {
                $this->info("DTSNotification for Document ID {$document->id} already exists, skipping.");
                continue;
            }

            foreach ([$creator, $receiver] as $user) {
                if ($user) {
                    $user->notify(new DocumentOverdue($document, $tracker, $user));
                    broadcast(new \App\Events\DocumentOverdue($document, $tracker, $user));
                } else {
                    $this->error("User not found for Document ID {$document->id}.");
                }
            }

            if ($isSuperAdmin && $receiver) {
                $authenticatedUser->notify(new DocumentOverdue($document, $tracker, $authenticatedUser));
                broadcast(new \App\Events\DocumentOverdue($document, $tracker, $authenticatedUser));
            }
        }

        $this->info('Overdue document check completed.');

    }
}
