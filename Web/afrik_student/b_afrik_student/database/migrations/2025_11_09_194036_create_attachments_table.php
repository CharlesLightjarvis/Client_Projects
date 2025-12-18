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
        Schema::create('attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // Polymorphic relation
            $table->uuidMorphs('attachable'); // attachable_id + attachable_type
            $table->string('name');
            $table->string('url')->comment('Local file path or external URL');
            $table->string('type')->nullable()->comment('pdf, video, ppt, zip, image, youtube, google_drive, etc.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
