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
        Schema::create('session_student', function (Blueprint $table) {
            $table->uuid('session_id')->constrained('formation_sessions')->cascadeOnDelete();
            $table->uuid('student_id')->constrained('users')->cascadeOnDelete();

            $table->primary(['session_id', 'student_id']);
            $table->unique(['session_id', 'student_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_student');
    }
};
