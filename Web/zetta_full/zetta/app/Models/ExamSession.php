<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ExamSession extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'certification_id',
        'exam_data',
        'answers',
        'started_at',
        'expires_at',
        'submitted_at',
        'score',
        'status'
    ];

    protected $casts = [
        'exam_data' => 'array',
        'answers' => 'array',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function certification(): BelongsTo
    {
        return $this->belongsTo(Certification::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && !$this->isExpired();
    }

    public function getRemainingTimeAttribute(): int
    {
        if ($this->isExpired()) {
            return 0;
        }

        return now()->diffInSeconds($this->expires_at);
    }

    public function getTotalQuestionsAttribute(): int
    {
        return count($this->exam_data['questions'] ?? []);
    }

    public function getAnsweredQuestionsAttribute(): int
    {
        return count($this->answers ?? []);
    }
}
