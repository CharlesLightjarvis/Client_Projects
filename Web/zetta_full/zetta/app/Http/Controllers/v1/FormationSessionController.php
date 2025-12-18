<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Session\StoreFormationSessionRequest;
use App\Http\Requests\v1\Session\UpdateFormationSessionRequest;
use App\Http\Services\V1\FormationSessionService;
use App\Models\FormationSession;
use App\Trait\ApiResponse;

class FormationSessionController extends Controller
{
    use ApiResponse;

    protected $sessionService;

    public function __construct(FormationSessionService $sessionService)
    {
        $this->sessionService = $sessionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sessions = $this->sessionService->getAllSessions();
        return $this->successResponse('Sessions retrieved successfully', 'sessions', $sessions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFormationSessionRequest $request)
    {
        $is_created = $this->sessionService->createSession($request->validated());
        if ($is_created) {
            return $this->successNoData('Session created successfully');
        }
        return $this->errorResponse('Session already exists or failed to create check the data', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $session = $this->sessionService->getSessionById($id);
        return $this->successResponse('Session retrieved successfully', 'session', $session);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFormationSessionRequest $request, $id)
    {
        $is_updated = $this->sessionService->updateSession($id, $request->validated());
        if ($is_updated) {
            return $this->successNoData('Session updated successfully');
        }
        return $this->errorResponse('Session not found or failed to update check the data', 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $is_deleted = $this->sessionService->deleteSession($id);
        if ($is_deleted) {
            return $this->successNoData('Session deleted successfully');
        }
        return $this->errorResponse('Session not found or failed to delete', 400);
    }

    public function getSessionStudents($sessionId)
    {
        $students = $this->sessionService->getSessionStudents($sessionId);
        return $this->successResponse('Students retrieved successfully', 'students', $students);
    }

    public function enrollStudent($sessionId, $studentId)
    {
        $is_enrolled = $this->sessionService->enrollStudent($studentId, $sessionId);
        if ($is_enrolled) {
            return $this->successNoData('Student enrolled successfully');
        }
        return $this->errorResponse('Failed to enroll student', 400);
    }


    public function unenrollStudent($sessionId, $studentId)
    {
        $is_unenrolled = $this->sessionService->unenrollStudent($studentId, $sessionId);
        if ($is_unenrolled) {
            return $this->successNoData('Student unenrolled successfully');
        }
        return $this->errorResponse('Failed to unenroll student', 400);
    }
}
