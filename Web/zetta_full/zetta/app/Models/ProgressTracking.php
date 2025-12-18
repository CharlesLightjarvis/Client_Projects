<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ProgressTracking extends Model
{
    use HasUuids;

    protected $table = 'progress_tracking';

    protected $fillable = [
        'user_id',
        'trackable_type',
        'trackable_id',
        'answer_details',
        'score',
        'passed',
        'attempt_number',
        'completed_at',
        'question_ids',
    ];

    protected $casts = [
        'answer_details' => 'array',
        'passed' => 'boolean',
        'completed_at' => 'datetime',
        'question_ids' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function trackable(): MorphTo
    {
        return $this->morphTo();
    }
}
