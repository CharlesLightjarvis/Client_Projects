<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class QuizConfiguration extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'configurable_type',
        'configurable_id',
        'total_questions',
        'difficulty_distribution',
        'module_distribution',
        'chapter_distribution',
        'passing_score',
        'time_limit'
    ];

    protected $casts = [
        'difficulty_distribution' => 'array',
        'module_distribution' => 'array',
        'chapter_distribution' => 'array',
    ];

    public function configurable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the total number of questions from chapter distribution
     */
    public function getTotalQuestionsFromChapters(): int
    {
        if (!$this->chapter_distribution) {
            return 0;
        }

        return array_sum($this->chapter_distribution);
    }

    /**
     * Check if chapter distribution is configured
     */
    public function hasChapterDistribution(): bool
    {
        return !empty($this->chapter_distribution);
    }

    /**
     * Get questions count for a specific chapter
     */
    public function getQuestionsForChapter(string $chapterId): int
    {
        return $this->chapter_distribution[$chapterId] ?? 0;
    }
}
