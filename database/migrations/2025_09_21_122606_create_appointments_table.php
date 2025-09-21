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
        Schema::disableForeignKeyConstraints();

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->integer('service_id')->constraint('services');
            $table->integer('booked_by_user_id')->constraint('users');
            $table->integer('registar_user_id')->constraint('users')->nullable();
            $table->string('type');
            $table->string('status');
            $table->dateTime('scheduled_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->text('postal_address')->nullable();
            $table->text('notes')->nullable();
            $table->integer('created_by')->constraint('users');
            $table->integer('updated_by')->constraint('users');
            $table->dateTime('canceled_at')->nullable();
            $table->integer('canceled_by')->constraint('users');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
