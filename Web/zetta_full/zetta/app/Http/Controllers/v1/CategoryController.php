<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Category\StoreCategoryRequest;
use App\Http\Requests\v1\Category\UpdateCategoryRequest;
use App\Http\Services\V1\CategoryService;
use App\Trait\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = $this->categoryService->getAllCategories();
        return $this->successResponse('Categories retrieved successfully', 'categories', $categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $is_created = $this->categoryService->createCategory($request->validated());
        if ($is_created) {
            return $this->successNoData('Category created successfully');
        }
        return $this->errorResponse('Category already exists', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $category = $this->categoryService->getCategoryById($id);
        return $this->successResponse('Category retrieved successfully', 'category', $category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, $id)
    {
        $is_updated = $this->categoryService->updateCategory($id, $request->validated());
        if ($is_updated) {
            return $this->successNoData('Category updated successfully');
        }
        return $this->errorResponse('Category not found, cannot be updated or already exists', 400);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $is_deleted = $this->categoryService->deleteCategory($id);
        if ($is_deleted) {
            return $this->successNoData('Category deleted successfully');
        }
        return $this->errorResponse('Category not found', 404);
    }
}
