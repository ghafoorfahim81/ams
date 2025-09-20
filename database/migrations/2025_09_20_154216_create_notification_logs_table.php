<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationLogsTable extends Migration
{
    public function up()
    {
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            
            // Polymorphic relation to the User or other entity that was notified
            $table->morphs('notifiable'); 
            
            $table->string('channel')->comment('e.g., email, sms, in-app')->index();
            $table->string('type')->comment('Mailable or Notification class name')->index();
            
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending')->index();
            $table->text('content')->nullable(); // The message body sent
            $table->json('data')->nullable();    // Extra data (e.g., error message on failure)
            
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notification_logs');
    }
}