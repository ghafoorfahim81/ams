<?php

namespace Database\Seeders\PostalCode;

use App\Models\PostalCode\PostalCode;
use Illuminate\Database\Seeder;

class PostalCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PostalCode::factory()->count(5)->create();
    }
}
