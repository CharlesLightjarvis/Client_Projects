<?php

namespace App\Http\Services\V1;

use App\Enums\InterestStatusEnum;
use App\Events\NewFormationInterest;
use App\Http\Resources\v1\FormationInterestResource;
use App\Mail\InterestReceived;
use App\Models\FormationInterest;
use App\Models\FormationSession;
use App\Models\User;
use App\Mail\InterestApproved;
use App\Trait\ApiResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FormationInterestService
{
    use ApiResponse;

    protected $sessionService;

    public function __construct(FormationSessionService $sessionService)
    {
        $this->sessionService = $sessionService;
    }


    public function getAllInterests()
    {
        return FormationInterestResource::collection(FormationInterest::with('formation')->orderBy('created_at', 'desc')->get());
    }

    public function createInterest($data)
    {
        try {
            DB::beginTransaction();

            $interest = FormationInterest::create($data);
            Log::info('New interest created', ['interest' => $interest]);

            // Load the formation relationship
            $interest->load('formation');
            Log::info('Formation loaded');

            // Broadcast the event
            broadcast(new NewFormationInterest($interest))->toOthers();
            Mail::to($interest->email)->send(new InterestReceived($interest));
            Log::info('Event broadcasted');

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    // public function approveInterest(FormationInterest $interest): bool
    // {
    //     try {
    //         DB::beginTransaction();

    //         // 1. Créer le compte utilisateur
    //         $result = $this->createUserAccount($interest);
    //         if (!$result) {
    //             throw new \Exception('Failed to create user account');
    //         }
    //         ['user' => $user, 'password' => $password] = $result;

    //         // 2. Trouver une session disponible
    //         $availableSessions = $this->sessionService->getAvailableSessions($interest->formation_id);
    //         if ($availableSessions->isEmpty()) {
    //             throw new \Exception('No available session found');
    //         }
    //         $session = $availableSessions->first();

    //         // 3. Inscrire à la session
    //         if (!$this->sessionService->enrollStudent($user, $session)) {
    //             throw new \Exception('Failed to enroll in session');
    //         }

    //         // 4. Marquer comme traité
    //         $interest->status = InterestStatusEnum::APPROVED->value;
    //         $interest->save();

    //         // 5. Envoyer l'email
    //         Mail::to($user->email)->send(new InterestApproved($interest, $user, $password));

    //         DB::commit();
    //         return true;
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         Log::error('Interest processing failed', [
    //             'interest_id' => $interest->id,
    //             'error' => $e->getMessage()
    //         ]);
    //         return false;
    //     }
    // }

    public function approveInterest(FormationInterest $interest): bool
    {
        try {
            DB::beginTransaction();

            // 1. Créer le compte utilisateur
            $result = $this->createUserAccount($interest);
            if (!$result) {
                throw new \Exception('Failed to create user account');
            }
            ['user' => $user, 'password' => $password] = $result;

            // 2. Inscrire à la formation
            $formation = $interest->formation;
            $formation->students()->attach($user->id);

            // 3. Inscrire à la première session disponible de la formation
            $session = $formation->sessions()
                ->where('enrolled_students', '<', DB::raw('capacity'))
                ->orderBy('start_date')
                ->first();

            if (!$session) {
                throw new \Exception('No available session found');
            }

            // Inscrire l'étudiant à la session
            $session->students()->attach($user->id);
            $session->increment('enrolled_students');

            // 4. Marquer comme traité
            $interest->status = InterestStatusEnum::APPROVED->value;
            $interest->save();

            // 5. Envoyer l'email
            Mail::to($user->email)->send(new InterestApproved($interest, $user, $password));

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Interest processing failed', [
                'interest_id' => $interest->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    private function createUserAccount(FormationInterest $interest): array
    {
        $password = Str::random(12);

        $user = User::create([
            'fullName' => $interest->fullName,
            'email' => $interest->email,
            'phone' => $interest->phone,
            'password' => Hash::make($password),
        ]);

        $user->assignRole('student');

        return ['user' => $user, 'password' => $password];
    }
}
