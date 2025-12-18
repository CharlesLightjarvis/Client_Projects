<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Services\V1\StudentFormationService;
use App\Trait\ApiResponse;
use Illuminate\Support\Facades\Auth;

class StudentFormationController extends Controller
{
    use ApiResponse;

    protected $studentFormationService;

    public function __construct(StudentFormationService $studentFormationService)
    {
        $this->studentFormationService = $studentFormationService;
    }

    public function index()
    {
        $formations = $this->studentFormationService->getStudentFormations($this->authStudentId());
        return $this->successResponse('Student formations retrieved successfully', 'formations', $formations);
    }

    public function show($formationId)
    {
        $formation = $this->studentFormationService->getFormationDetails($this->authStudentId(), $formationId);
        return $this->successResponse('Formation details retrieved successfully', 'formation', $formation);
    }

    public function authStudentId()
    {
        return Auth::id();
    }
}
