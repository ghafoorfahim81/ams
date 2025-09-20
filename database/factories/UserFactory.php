<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            
            'email' => $this->faker->unique()->safeEmail(),
            
            'mobile_number' => $this->faker->unique()->phoneNumber(), 
            
            'password' => Hash::make('password'), 
            
            'email_verified_at' => now(),
            'mobile_verified_at' => now(),

            'address' => $this->faker->address(),
            'postal_code' => $this->faker->postcode(),
            
        
            'created_by' => null, 
            'updated_by' => null, 
            
            'remember_token' => Str::random(10),
        ];
    }
}