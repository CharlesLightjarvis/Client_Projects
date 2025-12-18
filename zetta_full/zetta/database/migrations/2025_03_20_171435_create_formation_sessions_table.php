<?php

use App\Enums\CourseTypeEnum;
use App\Enums\SessionStatusEnum;
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
        Schema::create('formation_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('formation_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('course_type', CourseTypeEnum::values())->default(CourseTypeEnum::DAY->value);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('capacity')->unsigned();
            $table->enum('status', SessionStatusEnum::values())->default(SessionStatusEnum::ACTIVE->value);
            $table->integer('enrolled_students')->unsigned()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formation_sessions');
    }
};
