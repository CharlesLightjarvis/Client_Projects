<?php

namespace App\Http\Controllers;

use App\Enums\UserRoleEnum;
use App\Http\Requests\formations\StoreFormationRequest;
use App\Http\Requests\formations\UpdateFormationRequest;
use App\Http\Resources\FormationResource;
use App\Models\Formation;
use App\Services\FormationService;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function __construct(protected FormationService $formationService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse(
            FormationResource::collection($this->formationService->getAllFormations()),
            'Formations retrieved successfully'
        );
    }

    /**
     * Store a newly created resource in storage.
     * Can create formation with modules and lessons in one request (stepper mode).
     */
    public function store(StoreFormationRequest $request)
    {
        $formation = $this->formationService->createFormation($request->validated());

        return $this->createdSuccessResponse(
            FormationResource::make($formation),
            'Formation created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Formation $formation)
    {
        $formation = $this->formationService->getFormation($formation);

        return $this->successResponse(
            FormationResource::make($formation),
            'Formation fetched successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFormationRequest $request, Formation $formation)
    {
        $formation = $this->formationService->updateFormation($formation, $request->validated());
        return $this->successResponse(
            FormationResource::make($formation),
            'Formation updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation)
    {
        $this->formationService->deleteFormation($formation);
        return $this->deletedSuccessResponse('Formation deleted successfully');
    }

    /**
     * Get all formations where the authenticated student is enrolled.
     */
    public function getStudentEnrolledFormations(Request $request)
    {
        $user = $request->user();

        // Vérifier que l'utilisateur a le rôle student
        if (!$user->hasRole(UserRoleEnum::STUDENT->value)) {
            return $this->errorResponse(
                'Access denied. Only students can access their enrolled formations.',
                403
            );
        }

        $formations = $this->formationService->getStudentEnrolledFormations($user->id);

        return $this->successResponse(
            FormationResource::collection($formations),
            'Student enrolled formations retrieved successfully'
        );
    }
}
