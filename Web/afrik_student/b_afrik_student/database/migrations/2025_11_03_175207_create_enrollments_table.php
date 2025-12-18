<?php

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentStatus;
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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('course_session_id')->constrained('course_sessions')->cascadeOnDelete();
            $table->dateTime('enrollment_date');
            $table->string('status')->default(EnrollmentStatus::PENDING->value);
            $table->string('payment_status')->default(PaymentStatus::UNPAID->value);
            $table->decimal('payment_amount', 10, 2)->nullable();
            $table->timestamps();

            // Unique constraint to prevent duplicate enrollments
            $table->unique(['student_id', 'course_session_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
