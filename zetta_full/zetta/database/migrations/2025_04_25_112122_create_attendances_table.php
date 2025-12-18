<?php

use App\Enums\AttendanceStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('session_id');
            $table->uuid('student_id');
            $table->date('date');
            $table->enum('status', AttendanceStatus::values())->default(AttendanceStatus::PRESENT->value);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('session_id')->references('id')->on('formation_sessions')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');

            // Un étudiant ne peut avoir qu'une présence par session par jour
            $table->unique(['session_id', 'student_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
