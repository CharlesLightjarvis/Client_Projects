<?php

namespace App\Models;

use App\Enums\FormationLevel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formation extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'title',
        'description',
        'learning_objectives',
        'target_skills',
        'level',
        'duration',
        'image_url',
        'price'
    ];

    /**
     * Get the modules for the formation.
     */
    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    /**
     * Get the course sessions for the formation.
     */
    public function courseSessions(): HasMany
    {
        return $this->hasMany(CourseSession::class);
    }

    protected function casts(): array
    {
        return[
            'target_skills' => 'array',
            'level' => FormationLevel::class,
        ];
    }
}
