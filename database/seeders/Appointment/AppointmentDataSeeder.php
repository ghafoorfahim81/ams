<?php

namespace Database\Seeders\Appointment; 

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AppointmentDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Define the user ID for the creator (assuming user with ID 1 exists)
        $creatorId = 1; 

        // 1. Create a Sample Service (FIX: ADDED 'updated_by')
        $serviceId = DB::table('services')->insertGetId([
            'name' => 'Initial Consultation',
            'description' => 'A mandatory 60-minute consultation for new applicants.',
            'duration' => 60, // 60 minutes
            'capacity_per_slot' => 1, 
            'created_by' => $creatorId,
            'updated_by' => $creatorId, // <--- ADDED THIS REQUIRED FIELD
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $this->command->info("Created Service: Initial Consultation (ID: {$serviceId})");

        // 2. Generate Time Slots for the next 30 days (Weekdays only)
        $slotsToInsert = [];
        $startDate = Carbon::today();
        $daysToSeed = 30;

        for ($i = 0; $i < $daysToSeed; $i++) {
            $date = $startDate->copy()->addDays($i);

            // Skip weekends (Saturday = 6, Sunday = 0)
            if ($date->dayOfWeek === Carbon::SATURDAY || $date->dayOfWeek === Carbon::SUNDAY) {
                continue;
            }

            // Generate 5 slots between 9:00 AM and 4:00 PM
            $time = Carbon::parse('09:00:00');
            $initialCapacity = 5; 

            for ($j = 0; $j < 5; $j++) {
                $startTime = $time->format('H:i:s');
                $endTime = $time->copy()->addMinutes(60)->format('H:i:s');
                
                $slotsToInsert[] = [
                    'service_id' => $serviceId,
                    'slot_date' => $date->toDateString(), 
                    'start_time' => $startTime,
                    'end_time' => $endTime, 
                    'type' => 'REGULAR',
                    'initial_capacity' => $initialCapacity, 
                    'current_capacity' => $initialCapacity, 
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $time->addHours(1);

                if ($time->greaterThanOrEqualTo(Carbon::parse('15:00:00'))) {
                    break;
                }
            }
        }

        // 3. Insert all generated slots
        DB::table('slots')->insert($slotsToInsert);
        $this->command->info("Generated " . count($slotsToInsert) . " time slots for the next 30 weekdays.");
    }
}