<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Http\Requests\v1\Module\StoreModuleRequest;
use App\Http\Requests\v1\Module\UpdateModuleRequest;
use App\Http\Services\V1\ModuleService;
use App\Trait\ApiResponse;

class ModuleController extends Controller
{
    use ApiResponse;

    protected $moduleService;

    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modules = $this->moduleService->getAllModules();
        return $this->successResponse('Modules retrieved successfully', 'modules', $modules);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreModuleRequest $request)
    {
        $is_created = $this->moduleService->createModule($request->validated());
        if ($is_created) {
            return $this->successNoData('Module created successfully');
        }
        return $this->errorResponse('Module already exists or failed to create check the data', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $module = $this->moduleService->getModuleById($id);
        return $this->successResponse('Module retrieved successfully', 'module', $module);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModuleRequest $request, $id)
    {
        $is_updated = $this->moduleService->updateModule($id, $request->validated());
        if ($is_updated) {
            return $this->successNoData('Module updated successfully');
        }
        return $this->errorResponse('Module not found or cannot be updated', 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $is_deleted = $this->moduleService->deleteModule($id);
        if ($is_deleted) {
            return $this->successNoData('Module deleted successfully');
        }
        return $this->errorResponse('Module not found', 404);
    }
}
