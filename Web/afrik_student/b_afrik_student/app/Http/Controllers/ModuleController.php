<?php

namespace App\Http\Controllers;

use App\Http\Requests\modules\StoreModuleRequest;
use App\Http\Requests\modules\UpdateModuleRequest;
use App\Http\Resources\ModuleResource;
use App\Models\Module;
use App\Services\ModuleService;

class ModuleController extends Controller
{
    public function __construct(protected ModuleService $moduleService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse(
            ModuleResource::collection($this->moduleService->getAllModules()),
            'Modules retrieved successfully'
        );
    }


    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        return $this->successResponse(
            ModuleResource::make($module),
            'Module fetched successfully'
        );
    }

      /**
     * Store a single module with its lessons.
     */
    public function store(StoreModuleRequest $request)
    {
        $module = $this->moduleService->createModule($request->validated());

        return $this->createdSuccessResponse(
            ModuleResource::make($module),
            'Module created successfully'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModuleRequest $request, Module $module)
    {
        $module = $this->moduleService->updateModule($module, $request->validated());
        return $this->successResponse(
            ModuleResource::make($module),
            'Module updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        $module->delete();
        return $this->deletedSuccessResponse('Module deleted successfully');
    }

  
}
