<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Super Admin (ID 1)
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@ams.test'],
            [
                'full_name' => 'Super Admin AMS',
                'mobile_number' => '5551234567',
                'password' => Hash::make('password'),  
                'email_verified_at' => now(),
                'mobile_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole('super_admin');

        // 2. Create Regular User (ID 2)
        $regularUser = User::firstOrCreate(
            ['email' => 'user@ams.test'],
            [
                'full_name' => 'Applicant Test User',
                'mobile_number' => '5559876543',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'mobile_verified_at' => now(),
            ]
        );
        $regularUser->assignRole('user');

    }
}