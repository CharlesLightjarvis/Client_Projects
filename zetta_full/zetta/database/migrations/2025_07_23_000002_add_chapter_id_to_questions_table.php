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
        Schema::table('questions', function (Blueprint $table) {
            $table->foreignUuid('chapter_id')->nullable()->after('questionable_id')->constrained('chapters')->onDelete('cascade');
            $table->index('chapter_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['chapter_id']);
            $table->dropIndex(['chapter_id']);
            $table->dropColumn('chapter_id');
        });
    }
};