<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $certification_id
 * @property string $name
 * @property string|null $description
 * @property int $order
 * @property \App\Models\Certification $certification
 * @property \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property int $questions_count
 */
class Chapter extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'certification_id',
        'name',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function certification(): BelongsTo
    {
        return $this->belongsTo(Certification::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function getQuestionsCountAttribute(): int
    {
        return $this->questions()->count();
    }
}