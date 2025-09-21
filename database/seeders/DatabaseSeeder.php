<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Administration\DocumentTypeSeeder;
use Database\Seeders\Administration\SecurityLevelSeeder;
use Database\Seeders\Service\ServiceSeeder;
use Database\Seeders\Appointment\AppointmentSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

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
            AppointmentSeeder::class
        ]);

        $user->assignRole('super_admin');
    }
}
