<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Resource\StoreResourceRequest;
use App\Http\Requests\v1\Resource\UpdateResourceRequest;
use App\Http\Services\V1\ResourceService;
use App\Trait\ApiResponse;

class ResourceController extends Controller
{
    use ApiResponse;

    protected $resourceService;

    public function __construct(ResourceService $resourceService)
    {
        $this->resourceService = $resourceService;
    }

    public function index($lessonId)
    {
        $resources = $this->resourceService->getResourcesByLessonId($lessonId);
        return $this->successResponse('Resources retrieved successfully', 'resources', $resources);
    }

    public function show($id)
    {
        $resource = $this->resourceService->getResourceById($id);
        return $this->successResponse('Resource retrieved successfully', 'resource', $resource);
    }

    public function store(StoreResourceRequest $request)
    {
        try {
            $resource = $this->resourceService->createResource(
                $request->validated(),
                $request->file('file')
            );

            return $this->successResponse('Resource created successfully', 'resource', $resource);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create resource: ' . $e->getMessage(), 500);
        }
    }

    public function update(UpdateResourceRequest $request, $id)
    {
        try {
            $resource = $this->resourceService->updateResource(
                $id,
                $request->validated(),
                $request->hasFile('file') ? $request->file('file') : null
            );

            return $this->successResponse('Resource updated successfully', 'resource', $resource);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update resource: ' . $e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        $result = $this->resourceService->deleteResource($id);

        if ($result) {
            return $this->successNoData('Resource deleted successfully');
        }

        return $this->errorResponse('Resource not found or failed to delete', 404);
    }
}
