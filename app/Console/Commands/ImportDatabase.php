<?php

namespace App\Console\Commands;

use App\Enums\FollowupType;
use App\Models\Document\Document;
use App\Models\Document\Tracker;
use App\Models\HR\Directorate;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'importdb';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It import and transform the data from an old db to new one';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Starting import...');

        $oldDb = DB::connection('old_dts');

        $documents = collect($oldDb->table('documents')->get());
        $trackers = collect($oldDb->table('trackers')->get());
        $users = collect($oldDb->table('users')->get());
        $statuses = collect($oldDb->table('statuses')->get())->keyBy('id');
        $directorates = collect($oldDb->table('directorates')->get());

        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Tracker::truncate();
        Document::truncate();
        User::truncate();
        Directorate::truncate();

        DB::statement('ALTER TABLE '.Document::getModel()->getTable().' AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE '.Tracker::getModel()->getTable().' AUTO_INCREMENT = 6');
        DB::statement('ALTER TABLE '.User::getModel()->getTable().' AUTO_INCREMENT = 1');
        DB::statement('ALTER TABLE '.Directorate::getModel()->getTable().' AUTO_INCREMENT = 1');

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $directorates->each(function ($directorate): void {
            $newDirectorate = new Directorate;

            $newDirectorate->id = $directorate->id;
            $newDirectorate->name_fa = $directorate->name_prs;
            $newDirectorate->name_ps = $directorate->name_ps;
            $newDirectorate->name_en = $directorate->name_en;
            $newDirectorate->parent_id = $directorate->parent_id;

            $newDirectorate->incrementing = false;

            $newDirectorate->save();
        });

        $users->each(function ($user): void {
            $newUser = new User;

            $newUser->id = $user->id;
            // $newUser->name = $user->name;
            $newUser->user_name = $user->user_name;
            $newUser->email = $user->email;
            $newUser->password = $user->password;
            $newUser->status = $user->status;
            $newUser->employee_id = $user->employee_id;
            $newUser->created_by = $user->created_by;
            $newUser->updated_by = $user->updated_by;
            $newUser->created_at = $user->created_at;

            $newUser->incrementing = false;

            $newUser->save();
        });

        $documents->each(function ($document): void {
            Document::create([
                'title' => $document->title,
                'remark' => $document->remark,
                'created_at' => $document->created_at,
                'created_by' => $document->created_by,
                'updated_at' => $document->updated_by,
            ]);
        });

        $followupTypesMap = [
            1 => FollowupType::Actions->value,
            2 => FollowupType::Actions->value,
            3 => FollowupType::Respond->value,
            4 => FollowupType::Followup->value,
        ];

        $trackers->each(function ($tracker) use ($statuses, $followupTypesMap): void {

            $receiverUserId = User::where('employee_id', $tracker->receiver_employee_id)->first()->id;

            Tracker::create([
                'document_id' => $tracker->document_id,
                'sender_directorate_id' => $tracker->sender_directorate_id == 0 ? 59 : $tracker->sender_directorate_id,
                'receiver_user_id' => $receiverUserId,
                'status' => $statuses[$tracker->status_id]->slug ?? 'unknown',
                'document_type_id' => $tracker->doc_type_id,
                'in_num' => $tracker->in_num,
                'in_date' => $tracker->in_date,
                'out_num' => $tracker->out_num,
                'out_date' => $tracker->out_date,
                'type' => $tracker->type,
                'inout_flag' => $tracker->in_out,
                'request_deadline' => $tracker->request_deadline ?? 3,
                'focal_point_name' => $tracker->focal_point_name,
                'focal_point_phone' => $tracker->phone_number,
                'conclusion' => $tracker->conclusion,
                'actions' => $tracker->decision_subject,
                'security_level_id' => $tracker->security_level_id,
                'followup_type' => $followupTypesMap[$tracker->followup_type_id],
                'created_by' => $tracker->created_by,
                'created_at' => $tracker->created_at,
                'updated_by' => $tracker->updated_by,
            ]);
        });

        User::where('email', 'admin@admin.com')->first()->assignRole('super_admin');

        $this->info('Imported successfully.');
    }
}
