<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\User\StoreUserRequest;
use App\Http\Requests\v1\User\UpdateUserRequest;
use App\Http\Services\V1\UserService;
use App\Models\Formation;
use App\Models\User;
use App\Trait\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = $this->userService->getAllUsers();
        return $this->successResponse('Users retrieved successfully', 'users', $users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $is_created = $this->userService->createUser($request->validated());
        if ($is_created) {
            return $this->successNoData('User created successfully');
        }
        return $this->errorResponse('User already exists', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = $this->userService->getUserById($id);
        return $this->successResponse('User retrieved successfully', 'user', $user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $is_updated = $this->userService->updateUser($id, $request->validated());
        if ($is_updated) {
            return $this->successNoData('User updated successfully');
        }
        return $this->errorResponse('User not found or cannot be updated ', 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $is_deleted = $this->userService->deleteUser($id);
        if ($is_deleted) {
            return $this->successNoData('User deleted successfully');
        }
        return $this->errorResponse('User not found', 404);
    }

    public function getStudents()
    {
        $students = $this->userService->getStudents();
        return $this->successResponse('Students retrieved successfully', 'students', $students);
    }

    public function getStudentSessionsAndFormations($studentId)
    {
        $student = User::findOrFail($studentId);
        
        // Récupérer toutes les sessions auxquelles l'étudiant est inscrit
        $sessions = $student->enrolledSessions()->with(['formation'])->get();
        
        // Récupérer toutes les formations auxquelles l'étudiant est inscrit
        // via les sessions
        $formationIds = $sessions->pluck('formation_id')->unique();
        $formations = Formation::whereIn('id', $formationIds)->get();
        
        return response()->json([
            'success' => true,
            'sessions' => $sessions,
            'formations' => $formations
        ]);
    }
}
