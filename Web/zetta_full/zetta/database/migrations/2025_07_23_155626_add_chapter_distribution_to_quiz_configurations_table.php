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
        Schema::table('quiz_configurations', function (Blueprint $table) {
            $table->json('chapter_distribution')->nullable()->after('module_distribution');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_configurations', function (Blueprint $table) {
            $table->dropColumn('chapter_distribution');
        });
    }
};