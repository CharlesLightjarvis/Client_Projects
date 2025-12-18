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
        Schema::create('certification_students', function (Blueprint $table) {
            $table->uuid('certification_id')->constrained('certifications')->cascadeOnDelete();
            $table->uuid('student_id')->constrained('users')->cascadeOnDelete();

            $table->primary(['certification_id', 'student_id']);
            $table->unique(['certification_id', 'student_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certification_students');
    }
};
