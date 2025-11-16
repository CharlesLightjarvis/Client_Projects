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
        Schema::create('module_session_instructors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('course_session_id')->constrained('course_sessions')->cascadeOnDelete();
            $table->foreignUuid('module_id')->constrained('modules')->cascadeOnDelete();
            $table->foreignUuid('instructor_id')->constrained('users')->nullOnDelete();

            // Historique: dates de début et fin d'assignation
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();

            $table->timestamps();

            // Index pour optimiser les requêtes sur instructeurs actifs
            $table->index('ended_at');
            $table->index(['course_session_id', 'module_id', 'ended_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_session_instructors');
    }
};
