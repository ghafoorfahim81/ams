<?php

namespace Database\Factories\Appointment;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Appointment\Appointment;
use App\Models\Service\Service;
use App\Models\User;

class AppointmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Appointment::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'code' => fake()->word(),
            'service_id' => Service::factory(),
            'booked_by_user_id' => User::factory(),
            'registar_user_id' => User::factory(),
            'type' => fake()->randomElement(['regular','emergency']),
            'status' => fake()->randomElement(['pending','rescheduled', 'canceled','confirmed']),
            'scheduled_date' => fake()->dateTime(),
            'start_time' => fake()->time(),
            'end_time' => fake()->time(),
            'postal_address' => fake()->text(),
            'notes' => fake()->text(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'canceled_at' => fake()->dateTime(),
            'canceled_by' => User::factory(),
        ];
    }
}
