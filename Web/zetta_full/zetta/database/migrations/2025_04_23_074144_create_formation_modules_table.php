<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formation_modules', function (Blueprint $table) {
            $table->foreignUuid('formation_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('module_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->primary(['formation_id', 'module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formation_modules');
    }
};
