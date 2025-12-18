<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{

     /**
     * L'utilisateur peut-il créer un post ?
     */
    public function create(User $user): bool
    {
        // Grâce à Spatie, tu peux utiliser can()
        return $user->can('post.create');
    }

     /**
     * Determine if the given post can be updated by the user.
     */
    public function update(User $user, Post $post): Response
    {
        return $user->id === $post->user_id  ? Response::allow()
        : Response::deny('You do not own this post.');
    }

    /**
     * Determine if the given post can be deleted by the user.
     */
    public function delete(User $user, Post $post): Response
    {
        return $user->id === $post->user_id ? Response::allow()
        : Response::deny('You do not own this post.');
    }
}
