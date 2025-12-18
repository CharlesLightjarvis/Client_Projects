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
        Schema::create('progress_tracking', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained();
            $table->json('question_ids')->nullable();
            $table->nullableUuidMorphs('trackable');
            $table->json('answer_details');
            $table->integer('score');
            $table->boolean('passed');
            $table->integer('attempt_number');
            $table->timestamp('completed_at');
            $table->timestamps();

            // Nom d'index plus court
            $table->index(['trackable_type', 'trackable_id', 'user_id', 'attempt_number'], 'progress_tracking_composite_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress_tracking');
    }
};
