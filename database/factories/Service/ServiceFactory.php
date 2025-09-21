<?php

namespace Database\Factories\Service;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Service\Service;
use App\Models\User;

class ServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Service::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'duration' => fake()->numberBetween(1, 100),
            'capacity_per_slot' => fake()->numberBetween(1, 100),
            'is_active' => fake()->boolean(),
            'description' => fake()->text(),
            'is_emergency' => fake()->boolean(),
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
