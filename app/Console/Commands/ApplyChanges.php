<?php

namespace App\Console\Commands;

use App\Models\Document\Document;
use App\Models\Document\Tracker;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Console\Command;

class ApplyChanges extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'apply:changes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $trackersUpdate = Tracker::where('created_by',1)->get();
        foreach ($trackersUpdate as $tracker) {
            $tracker->update([
                'created_by' => 20,
            ]);
        }

        $documentsUpdate = Document::where('created_by',1)->get();
        foreach ($documentsUpdate as $document) {
            $document->update([
                'created_by' => 20,
            ]);
        }

        $notificationsUpdate = DB::table('notifications')->where('notifiable_id',1)->get();
        foreach ($notificationsUpdate as $notification) {
            DB::table('notifications')->where('id',$notification->id)->update([
                'notifiable_id' => 20,
            ]);
        }

        // $userUpdate = User::where('id', 1)->first();
        // $userUpdate->update([
        //     'employee_id' => 18328,
        // ]);
    }
}
