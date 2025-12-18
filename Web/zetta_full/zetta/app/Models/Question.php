<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Question extends Model
{
    use HasUuids, HasFactory;

    protected $fillable = [
        'questionable_type',
        'questionable_id',
        'chapter_id',
        'question',
        'answers',
        'type',
        'difficulty',
        'points',
    ];

    protected $casts = [
        'answers' => 'array',
    ];

    public function questionable(): MorphTo
    {
        return $this->morphTo();
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function scopeCertificationQuestions($query)
    {
        return $query->whereNotNull('chapter_id');
    }
}
