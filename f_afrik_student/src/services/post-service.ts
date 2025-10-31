// services/postService.ts
import api from '@/lib/api'
import type {
  ApiResponse,
  ApiErrorResponse,
  CreatePostData,
  Post,
  UpdatePostData,
} from '@/types/post'

export const postService = {
  // Récupérer tous les posts
  async getAllPosts(): Promise<Post[]> {
    const response = await api.get<ApiResponse<Post[]>>('/api/posts')
    return response.data.data
  },

  // Récupérer un post par ID
  async getPostById(id: number): Promise<Post> {
    const response = await api.get<ApiResponse<Post>>(`/api/posts/${id}`)
    return response.data.data
  },

  // Créer un nouveau post
  async createPost(
    data: CreatePostData,
  ): Promise<{ post: Post; message: string }> {
    try {
      const response = await api.post<ApiResponse<Post>>('/api/posts', data)
      return {
        post: response.data.data,
        message: response.data.message,
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiErrorResponse
        const err: any = new Error(
          errorData.message || 'Erreur lors de la création du post',
        )
        err.errors = errorData.errors
        throw err
      }
      throw error
    }
  },

  // Mettre à jour un post
  async updatePost(
    id: number,
    data: UpdatePostData,
  ): Promise<{ post: Post; message: string }> {
    try {
      const response = await api.put<ApiResponse<Post>>(
        `/api/posts/${id}`,
        data,
      )
      return {
        post: response.data.data,
        message: response.data.message,
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiErrorResponse
        const err: any = new Error(
          errorData.message || 'Erreur lors de la mise à jour du post',
        )
        err.errors = errorData.errors
        throw err
      }
      throw error
    }
  },

  // Supprimer un post
  async deletePost(id: number): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(
        `/api/posts/${id}`,
      )
      return {
        message: response.data.message,
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data as ApiErrorResponse
        const err: any = new Error(
          errorData.message || 'Erreur lors de la suppression du post',
        )
        err.errors = errorData.errors
        throw err
      }
      throw error
    }
  },
}
