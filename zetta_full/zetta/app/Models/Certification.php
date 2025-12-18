<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * @property string $id
 * @property \App\Models\Formation $formation
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property \App\Models\QuizConfiguration|null $quizConfiguration
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Models\Chapter> $chapters
 */
class Certification extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image',
        'provider',
        'validity_period',
        'level',
        'slug',
        'benefits',
        'skills',
        'best_for',
        'prerequisites',
        'link',
    ];

    public function getLinkAttribute(): string
    {
        return "/certifications/" . $this->slug;
    }

    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'formation_certifications', 'certification_id', 'formation_id')->withTimestamps();
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'certification_students', 'certification_id', 'student_id')->withTimestamps();
    }

    // Add this relationship
    public function progressTrackings(): MorphMany
    {
        return $this->morphMany(ProgressTracking::class, 'trackable');
    }

    protected function casts(): array
    {
        return [
            'benefits' => 'array',
            'skills' => 'array',
            'best_for' => 'array',
            'prerequisites' => 'array',
        ];
    }

    public function quizConfiguration(): MorphOne
    {
        return $this->morphOne(QuizConfiguration::class, 'configurable');
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class)->orderBy('order');
    }

    // public function questions(): MorphMany
    // {
    //     return $this->morphMany(Question::class, 'questionable');
    // }
}
