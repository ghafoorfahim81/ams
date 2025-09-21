<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQrCodesTable extends Migration
{
    public function up()
    {
        Schema::create('qr_codes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('appointment_id')->unique(); // One-to-One

            // This is the non-PII code that goes INTO the QR image (Day 8 requirement)
            $table->string('code', 32)->unique();

            $table->boolean('is_active')->default(true)->comment('Toggled false if appointment is cancelled');
            $table->dateTime('scanned_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Foreign Key
            // $table->foreign('appointment_id')->references('id')->on('appointments')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('qr_codes');
    }
}
