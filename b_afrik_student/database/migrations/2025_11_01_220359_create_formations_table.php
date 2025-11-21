<?php

use App\Enums\FormationLevel;
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
        Schema::create('formations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('learning_objectives')->nullable();
            $table->json('target_skills')->nullable(); // List of skills
            $table->string('level')->default(FormationLevel::EASY->value);
            $table->integer('duration')->comment('Duration in hours');
            $table->string('image_url')->nullable();
            $table->decimal('price', 8, 2)->nullable(); // Ex: 99.99
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
