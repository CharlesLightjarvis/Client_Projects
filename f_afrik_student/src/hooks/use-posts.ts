// hooks/usePosts.ts

import { usePostStore, type PostStore } from "@/stores/post-store"

// Selectors pour éviter les re-renders inutiles
const postsSelector = (state: PostStore) => state.posts
const currentPostSelector = (state: PostStore) => state.currentPost
const loadingSelector = (state: PostStore) => state.loading
const errorSelector = (state: PostStore) => state.error

export const usePosts = () => {
  const posts = usePostStore(postsSelector)
  const currentPost = usePostStore(currentPostSelector)
  const loading = usePostStore(loadingSelector)
  const error = usePostStore(errorSelector)
  
  // Access the entire store for actions to avoid creating new objects
  const { 
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    setCurrentPost,
    clearError
  } = usePostStore.getState()

  return {
    // État
    posts,
    currentPost,
    loading,
    error,
    // Actions
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    setCurrentPost,
    clearError,
  }
}