<?php

use App\Enums\QuestionDifficultyEnum;
use App\Enums\QuestionTypeEnum;
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
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->nullableUuidMorphs('questionable');
            $table->text('question');
            $table->json('answers'); // Format: [{"id": 1, "text": "Réponse", "correct": true}]
            $table->enum('difficulty', QuestionDifficultyEnum::values())->default(QuestionDifficultyEnum::EASY->value);
            $table->enum('type', QuestionTypeEnum::values())->default(QuestionTypeEnum::NORMAL->value);
            $table->integer('points');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
