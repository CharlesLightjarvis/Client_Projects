<?php

namespace App\Models;

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Enrollment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'student_id',
        'course_session_id',
        'enrollment_date',
        'status',
        'payment_status',
        'payment_amount',
    ];

    protected $casts = [
        'enrollment_date' => 'datetime',
        'status' => EnrollmentStatus::class,
        'payment_status' => PaymentStatus::class,
        'payment_amount' => 'decimal:2',
    ];

    /**
     * Get the student (user) enrolled.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the course session for this enrollment.
     */
    public function courseSession(): BelongsTo
    {
        return $this->belongsTo(CourseSession::class, 'course_session_id');
    }

    /**
     * Check if payment is complete.
     */
    public function isPaid(): bool
    {
        return $this->payment_status === PaymentStatus::PAID;
    }

    /**
     * Cancel the enrollment.
     */
    public function cancel(): void
    {
        $this->update(['status' => EnrollmentStatus::CANCELLED]);
    }

    /**
     * Mark as completed.
     */
    public function confirm(): void
    {
        $this->update(['status' => EnrollmentStatus::CONFIRMED]);
    }
}
