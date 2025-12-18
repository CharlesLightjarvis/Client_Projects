<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Interest\StoreFormationInterestRequest;
use App\Http\Requests\v1\Interest\UpdateFormationInterestRequest;
use App\Http\Services\V1\FormationInterestService;
use App\Models\FormationInterest;
use App\Trait\ApiResponse;

class FormationInterestController extends Controller
{
    use ApiResponse;

    protected $interestService;

    public function __construct(FormationInterestService $interestService)
    {
        $this->interestService = $interestService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $interests = $this->interestService->getAllInterests();
        return $this->successResponse('Interests retrieved successfully', 'interests', $interests);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFormationInterestRequest $request)
    {
        $is_created = $this->interestService->createInterest($request->validated());
        if ($is_created) {
            return $this->successNoData('Interest created successfully');
        }
        return $this->errorResponse('Interest already exists or failed to create check the data', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFormationInterestRequest $request,  $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }

    public function approve($id)
    {
        try {
            $interest = FormationInterest::where('id', $id)->firstOrFail();

            $result = $this->interestService->approveInterest($interest);

            if ($result) {
                return $this->successNoData('Interest approved successfully');
            }

            return $this->errorResponse('Failed to approve interest', 400);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
