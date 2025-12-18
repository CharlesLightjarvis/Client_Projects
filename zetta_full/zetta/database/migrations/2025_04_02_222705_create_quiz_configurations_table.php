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
        Schema::create('quiz_configurations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuidMorphs('configurable'); // Pour certification ou lesson
            $table->integer('total_questions');
            $table->json('difficulty_distribution'); // {"easy": 40, "medium": 40, "hard": 20}
            $table->integer('passing_score')->default(70);
            $table->integer('time_limit')->nullable(); // en minutes
            $table->json('module_distribution')->nullable(); // {"module_id1": 10, "module_id2": 30, ...}

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_configurations');
    }
};
