<?php

namespace Database\Seeders\Appointment;

use App\Models\Appointment\Appointment;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Appointment::factory()->count(5)->create();
    }
}
