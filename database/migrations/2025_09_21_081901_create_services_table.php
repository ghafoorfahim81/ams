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

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->integer('duration');
            $table->integer('capacity_per_slot');
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->boolean('is_emergency')->default(false);
            $table->integer('created_by')->constraint('users');
            $table->integer('updated_by')->constraint('users');
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
