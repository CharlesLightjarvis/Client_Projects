<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'status',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            // to get the value of the status
            // User::first()->status->value
            'status' => UserStatus::class,
        ];
    }

    public function posts() {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the enrollments for the student.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    /**
     * Get the course sessions taught by the instructor.
     */
    public function taughtCourseSessions()
    {
        return $this->hasMany(CourseSession::class, 'instructor_id');
    }

    /**
     * Get the lesson progress for the student.
     */
    public function lessonProgress()
    {
        return $this->hasMany(LessonProgress::class, 'student_id');
    }

    /**
     * Get the course sessions the user is enrolled in (as a student).
     */
    public function enrolledCourseSessions()
    {
        return $this->belongsToMany(CourseSession::class, 'enrollments', 'student_id', 'course_session_id')
            ->withPivot('enrollment_date', 'status', 'payment_status', 'payment_amount')
            ->withTimestamps();
    }
}
