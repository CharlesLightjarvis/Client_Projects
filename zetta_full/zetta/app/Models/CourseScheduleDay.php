<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseScheduleDay extends Model
{
    use HasUuids;
    protected $fillable = ['course_schedule_id', 'day_of_week'];

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(CourseSchedule::class, 'course_schedule_id');
    }

    // Méthode pour obtenir le nom du jour en français
    public function getDayNameAttribute()
    {
        $days = [
            1 => 'Lundi',
            2 => 'Mardi',
            3 => 'Mercredi',
            4 => 'Jeudi',
            5 => 'Vendredi',
            6 => 'Samedi',
            7 => 'Dimanche'
        ];
        
        return $days[$this->day_of_week] ?? '';
    }
}
