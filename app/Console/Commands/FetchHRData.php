<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FetchHRData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-hr-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch data from HR system and insert into the DTS database';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        (new \App\Http\Controllers\APIController)->getDirectoratesFromLocalHR();
        (new \App\Http\Controllers\APIController)->getEmployeesFromLocalHR();
    }
}
