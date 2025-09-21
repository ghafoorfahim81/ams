<?php

namespace Database\Factories\PostalCode;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PostalCode\PostalCode;

class PostalCodeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PostalCode::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'code' => fake()->word(),
            'region_name' => fake()->word(),
            'is_permitted' => fake()->boolean(),
        ];
    }
}
