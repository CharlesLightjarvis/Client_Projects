<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleSessionInstructor extends Model
{
    use HasUuids;

    protected $table = 'module_session_instructors';

    protected $fillable = [
        'course_session_id',
        'module_id',
        'instructor_id',
        'started_at',
        'ended_at',
    ];

    public function courseSession(): BelongsTo
    {
        return $this->belongsTo(CourseSession::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
