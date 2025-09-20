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
        Schema::create('slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade'); 
            $table->date('slot_date');
            $table->time('start_time');
            $table->enum('type', ['REGULAR', 'EMERGENCY'])->default('REGULAR'); 
            $table->unsignedSmallInteger('initial_capacity'); // Max capacity set by admin 
            $table->unsignedSmallInteger('current_capacity'); // Decremented on booking
            $table->boolean('is_active')->default(true);

            //  Only one slot of a specific type for a given service/time
            $table->unique(['service_id', 'slot_date', 'start_time', 'type'], 'unique_service_slot');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};
