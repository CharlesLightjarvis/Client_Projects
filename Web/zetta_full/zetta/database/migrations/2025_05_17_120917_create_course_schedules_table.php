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
        Schema::create('course_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('session_id')->constrained('formation_sessions')->cascadeOnDelete();
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room')->nullable();
            $table->enum('recurrence', ['weekly', 'biweekly', 'monthly'])->default('weekly');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->foreignUuid('teacher_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_schedules');
    }
};
