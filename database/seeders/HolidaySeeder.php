<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Holiday;
use Carbon\Carbon;

class HolidaySeeder extends Seeder
{
    public function run()
    {
        // Example for the current year
        $year = Carbon::now()->year;

        Holiday::firstOrCreate(['date' => Carbon::parse("{$year}-01-01")->toDateString()], [
            'name' => 'New Year\'s Day'
        ]);
        
        Holiday::firstOrCreate(['date' => Carbon::parse("{$year}-12-25")->toDateString()], [
            'name' => 'Christmas Day'
        ]);
    }
}