<?php

namespace Database\Seeders\Holiday;

use App\Models\Holiday\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Holiday::factory()->count(5)->create();
    }
}
