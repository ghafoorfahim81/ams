<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointment_participants', function (Blueprint $table) {
            $table->id();
            $table->integer('appointment_id')->constraint('appointments');
            $table->string('full_name');
            $table->string('relationship');
            $table->string('identification_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_participants');
    }
};
