<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonProgress extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'lesson_progress';

    protected $fillable = [
        'student_id',
        'lesson_id',
        'completed',
        'completed_at',
        'score',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
        'score' => 'decimal:2',
    ];

    /**
     * Get the student who owns this progress.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the lesson for this progress.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Mark the lesson as completed.
     */
    public function markAsCompleted(?float $score = null): void
    {
        $this->update([
            'completed' => true,
            'completed_at' => now(),
            'score' => $score,
        ]);
    }

    /**
     * Mark the lesson as incomplete.
     */
    public function markAsIncomplete(): void
    {
        $this->update([
            'completed' => false,
            'completed_at' => null,
            'score' => null,
        ]);
    }
}
