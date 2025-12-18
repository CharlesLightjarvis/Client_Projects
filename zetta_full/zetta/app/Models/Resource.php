<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Resource extends Model
{
    use HasUuids;

    protected $fillable = [
        'lesson_id',
        'title',
        'description',
        'file_path',
        'type',
        'size',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
