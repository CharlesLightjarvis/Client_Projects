<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Module extends Model
{
    use HasUuids;

    protected $fillable = [
        'formation_id',
        'name',
        'slug',
        'description',
    ];

    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'formation_modules', 'module_id', 'formation_id')->withTimestamps();
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function questions(): MorphMany
{
    return $this->morphMany(Question::class, 'questionable');
}
}
