<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Formation extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'level',
        'duration',
        'price',
        'discount_price',
        'category_id',
        'prerequisites',
        'objectives',
    ];

    public function getLinkAttribute(): string
    {
        return "/formations/" . $this->slug;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }


    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'formation_student', 'formation_id', 'student_id')->withTimestamps();
    }

    public function certifications(): BelongsToMany
    {
        return $this->belongsToMany(Certification::class, 'formation_certifications', 'formation_id', 'certification_id')->withTimestamps();
    }

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'formation_modules', 'formation_id', 'module_id')->withTimestamps();
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(FormationSession::class);
    }

    public function interests(): HasMany
    {
        return $this->hasMany(FormationInterest::class);
    }

    protected function casts(): array
    {
        return [
            'prerequisites' => 'array',
            'objectives' => 'array',
        ];
    }

    public function Payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
