<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run()
    {
        Service::firstOrCreate(['name' => 'Regular Consultation'], [
            'description' => 'Standard appointment for general inquiries.',
            'duration' => 30, 
            'capacity' => 2,   // Allows for 2 simultaneous appointments per slot
            'is_active' => true,
        ]);

        Service::firstOrCreate(['name' => 'Document Verification'], [
            'description' => 'Dedicated service requiring required documents.',
            'duration' => 60, 
            'capacity' => 1,
            'is_active' => true,
        ]);
        
        // Dedicated "Emergency" service must be available 
        Service::firstOrCreate(['name' => 'Emergency Service'], [
            'description' => 'Limited, high-priority slots.',
            'duration' => 15, 
            'capacity' => 1,
            'is_active' => true,
        ]);
    }
}