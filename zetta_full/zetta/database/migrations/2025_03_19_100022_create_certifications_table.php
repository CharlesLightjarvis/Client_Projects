<?php

use App\Enums\LevelEnum;
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
        Schema::create('certifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('provider');
            $table->integer('validity_period')->unsigned(); // par année
            $table->enum('level', LevelEnum::values())->default(LevelEnum::BEGINNER->value);
            $table->json('benefits')->nullable();
            $table->json('skills')->nullable();
            $table->json('best_for')->nullable();
            $table->json('prerequisites')->nullable();
            $table->string('link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certifications');
    }
};
