<?php

namespace App\Events;

use App\Models\FormationInterest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewFormationInterest implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $formationInterest;

    public function __construct(FormationInterest $formationInterest)
    {
        $this->formationInterest = $formationInterest;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('formation-interests')
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'interest' => [
                'id' => $this->formationInterest->id,
                'fullName' => $this->formationInterest->fullName,
                'email' => $this->formationInterest->email,
                'phone' => $this->formationInterest->phone,
                'message' => $this->formationInterest->message,
                'formation' => [
                    'id' => $this->formationInterest->formation->id,
                    'name' => $this->formationInterest->formation->name,
                    'description' => $this->formationInterest->formation->description,
                    'price' => $this->formationInterest->formation->price,
                    'duration' => $this->formationInterest->formation->duration,
                    'level' => $this->formationInterest->formation->level,
                ]
            ]
        ];
    }
}
