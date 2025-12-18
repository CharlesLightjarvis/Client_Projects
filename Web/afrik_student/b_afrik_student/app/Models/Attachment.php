<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'url',
        'type',
        'attachable_id',   // ID du modèle lié (leçon, module, formation)
        'attachable_type', // Type du modèle lié
    ];

    public function attachable()
    {
        return $this->morphTo();
    }
}
