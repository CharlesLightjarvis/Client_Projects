<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasUuids, Notifiable, HasRoles, HasApiTokens;

    protected $fillable = [
        'fullName',
        'email',
        'imageUrl',
        'password',
        'status',
        'email_verified_at',
        'bio',
        'title',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    /**
     * Sessions où l'utilisateur est enseignant
     */
    public function teachingSessions(): HasMany
    {
        return $this->hasMany(FormationSession::class, 'teacher_id');
    }

    /**
     * Sessions où l'utilisateur est étudiant
     */
    public function enrolledSessions(): BelongsToMany
    {
        return $this->belongsToMany(FormationSession::class, 'session_student', 'student_id', 'session_id')->withTimestamps();
    }

    public function certifications(): BelongsToMany
    {
        return $this->belongsToMany(Certification::class, 'certification_students', 'student_id', 'certification_id')->withTimestamps();
    }

    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'formation_student', 'student_id', 'formation_id')->withTimestamps();
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'student_id');
    }
}
