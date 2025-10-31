// stores/postStore.ts
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import type { Post, CreatePostData, UpdatePostData } from '../types/post'
import { postService } from '@/services/post-service'

interface PostState {
  posts: Post[]
  currentPost: Post | null
  loading: boolean
  error: string | null
}

interface PostActions {
  fetchPosts: () => Promise<void>
  fetchPost: (id: number) => Promise<void>
  createPost: (data: CreatePostData) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  updatePost: (
    id: number,
    data: UpdatePostData,
  ) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  deletePost: (id: number) => Promise<{
    success: boolean
    message?: string
    errors?: Record<string, string[]>
  }>
  setCurrentPost: (post: Post | null) => void
  clearError: () => void
}

export type PostStore = PostState & PostActions

export const usePostStore = create<PostStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // État initial
      posts: [],
      currentPost: null,
      loading: false,
      error: null,

      // Actions avec gestion d'erreur améliorée
      fetchPosts: async () => {
        const { loading } = get()
        if (loading) return // Évite les appels multiples

        set({ loading: true, error: null })
        try {
          const posts = await postService.getAllPosts()
          console.log(posts)

          set({ posts, loading: false })
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Une erreur est survenue lors du chargement des posts'
          set({
            error: errorMessage,
            loading: false,
          })
        }
      },

      fetchPost: async (id: number) => {
        set({ loading: true, error: null })
        try {
          const post = await postService.getPostById(id)

          set({ currentPost: post, loading: false })
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Une erreur est survenue lors du chargement du post'
          set({
            error: errorMessage,
            loading: false,
          })
        }
      },

      createPost: async (data: CreatePostData) => {
        set({ loading: true, error: null })
        try {
          const { message } = await postService.createPost(data)
          // After creating a post, refetch all posts to ensure policies are included
          const posts = await postService.getAllPosts()
          set({
            posts,
            loading: false,
          })
          return { success: true, message }
        } catch (error: any) {
          set({
            loading: false,
          })
          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      updatePost: async (id: number, data: UpdatePostData) => {
        set({ loading: true, error: null })
        try {
          const { post, message } = await postService.updatePost(id, data)
          set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? post : p)),
            currentPost:
              state.currentPost?.id === id ? post : state.currentPost,
            loading: false,
          }))
          return { success: true, message }
        } catch (error: any) {
          set({
            loading: false,
          })
          return {
            success: false,
            message: error.message,
            errors: error.errors,
          }
        }
      },

      deletePost: async (id: number) => {
        set({ loading: true, error: null })
        try {
          const { message } = await postService.deletePost(id)
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
            currentPost:
              state.currentPost?.id === id ? null : state.currentPost,
            loading: false,
          }))
          return { success: true, message }
        } catch (error: any) {
          const errorMessage =
            error.message ||
            'Une erreur est survenue lors de la suppression du post'
          set({
            error: errorMessage,
            loading: false,
          })
          return { success: false, message: errorMessage, errors: error.errors }
        }
      },

      setCurrentPost: (post: Post | null) => {
        set({ currentPost: post })
      },

      clearError: () => {
        set({ error: null })
      },
    })),
    { name: 'post-store' },
  ),
)
