<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Certification\UpdateCertificationRequest;
use App\Http\Requests\v1\Certification\StoreCertificationRequest;
use App\Http\Services\V1\CertificationService;
use App\Trait\ApiResponse;

class CertificationController extends Controller
{
    use ApiResponse;

    protected $certificationService;

    public function __construct(CertificationService $certificationService)
    {
        $this->certificationService = $certificationService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $certifications = $this->certificationService->getAllCertifications();
        return $this->successResponse('Certifications retrieved successfully', 'certifications', $certifications);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCertificationRequest $request)
    {
        $is_created = $this->certificationService->createCertification($request->validated());
        if ($is_created) {
            return $this->successNoData('Certification created successfully');
        }
        return $this->errorResponse('Certification already exists or failed to create check the data', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $certification = $this->certificationService->getCertificationById($id);
        return $this->successResponse('Certification retrieved successfully', 'certification', $certification);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificationRequest $request,  $id)
    {
        $is_updated = $this->certificationService->updateCertification($id, $request->validated());
        if ($is_updated) {
            return $this->successNoData('Certification updated successfully');
        }
        return $this->errorResponse('Certification not found or cannot be updated', 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $is_deleted = $this->certificationService->deleteCertification($id);
        if ($is_deleted) {
            return $this->successNoData('Certification deleted successfully');
        }
        return $this->errorResponse('Certification not found', 404);
    }
}
