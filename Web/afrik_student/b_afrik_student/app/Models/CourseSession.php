<?php

namespace App\Models;

use App\Enums\SessionStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSession extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'course_sessions';

    protected $fillable = [
        'formation_id',
        'start_date',
        'end_date',
        'status',
        'max_students',
        'location',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'status' => SessionStatus::class,
        'max_students' => 'integer',
    ];

    /**
     * Get the formation that owns the course session.
     */
    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    /**
     * Get the enrollments for this course session.
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'course_session_id');
    }

    /**
     * Get the students enrolled in this course session.
     */
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_session_id', 'student_id')
            ->withPivot('enrollment_date', 'status', 'payment_status', 'payment_amount')
            ->withTimestamps();
    }

    /**
     * Check if the course session is full.
     * Only counts confirmed enrollments.
     */
    public function isFull(): bool
    {
        return $this->enrollments()->where('status', \App\Enums\EnrollmentStatus::CONFIRMED)->count() >= $this->max_students;
    }

    /**
     * Get available spots in the course session.
     * Only counts confirmed enrollments.
     */
    public function availableSpots(): int
    {
        $confirmedEnrollments = $this->enrollments()->where('status', \App\Enums\EnrollmentStatus::CONFIRMED)->count();
        return max(0, $this->max_students - $confirmedEnrollments);
    }

    /**
     * Get only the current active instructors for this session.
     */
    public function currentInstructors(): HasMany
    {
        return $this->hasMany(ModuleSessionInstructor::class)
            ->whereNull('ended_at');
    }

    /**
     * Get the complete instructor history for this session (ordered by date).
     */
    public function instructorHistory(): HasMany
    {
        return $this->hasMany(ModuleSessionInstructor::class)
            ->orderBy('started_at');
    }
}
