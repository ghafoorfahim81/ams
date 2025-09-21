<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Service\ServiceSeeder;
use Database\Seeders\Appointment\AppointmentSeeder;
use Database\Seeders\PostalCode\PostalCodeSeeder;
use Database\Seeders\Holiday\HolidaySeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $user = User::factory()->create([
            'full_name' => 'admin',
            'email' => 'admin@ams.com',
        ]);

        $this->call([
            RolePermissionSeeder::class,
            ServiceSeeder::class,
            AppointmentSeeder::class,
            PostalCodeSeeder::class,
            HolidaySeeder::class
        ]);

        $user->assignRole('super_admin');
    }
}
