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
        'instructor_id',
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
     * Get the instructor (user) that teaches this course session.
     */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
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
     */
    public function isFull(): bool
    {
        return $this->enrollments()->count() >= $this->max_students;
    }

    /**
     * Get available spots in the course session.
     */
    public function availableSpots(): int
    {
        return max(0, $this->max_students - $this->enrollments()->count());
    }
}
