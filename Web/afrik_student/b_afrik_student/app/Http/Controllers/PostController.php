<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;


class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user')->orderBy('created_at', 'desc')->get();


        return $this->successResponse(PostResource::collection($posts), "Posts fetched successfully");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Post::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
        ]);

        $validated['user_id'] = $request->user()->id;


        return $this->createdSuccessResponse(Post::create($validated), "Post created successfully");
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return $this->successResponse(PostResource::make($post), "Post fetched successfully");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated= $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
        ]);

        $post->update($validated);
        return $this->successResponse(PostResource::make($post->fresh()), "Post updated successfully");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {   
        $this->authorize('delete', $post);
        
        $post->delete();
        return $this->deletedSuccessResponse("Post deleted successfully");
    }
}