<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PostalCode;

class PostalCodeSeeder extends Seeder
{
    public function run()
    {
        $permittedCodes = [
            '10001', '10002', '90210', 'SW1A 0AA' 
        ];

        foreach ($permittedCodes as $code) {
            PostalCode::firstOrCreate(['code' => $code], ['is_permitted' => true]);
        }
        
        // restricted code for testing the restriction logic
        PostalCode::firstOrCreate(['code' => '99999'], ['is_permitted' => false]);
    }
}