<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSchedule extends Model
{
    use HasUuids;
    protected $fillable = [
        'session_id', 'start_time', 'end_time', 
        'room', 'recurrence', 'start_date', 'end_date', 'teacher_id'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    // Relation avec la session
    public function session(): BelongsTo
    {
        return $this->belongsTo(FormationSession::class);
    }

    // Relation avec le professeur
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    // Relation avec les jours
    public function days(): HasMany
    {
        return $this->hasMany(CourseScheduleDay::class);
    }

    // Méthode pour obtenir la formation associée
    public function formation()
    {
        return $this->session->formation;
    }
}
