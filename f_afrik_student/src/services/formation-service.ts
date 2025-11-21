import api from '@/lib/api'
import type {
  Formation,
  CreateFormationData,
  UpdateFormationData,
  ApiResponse,
} from '@/types/formation'

class FormationService {
  /**
   * GET - Retrieve all formations
   */
  async getAllFormations(): Promise<Formation[]> {
    const response = await api.get<ApiResponse<Formation[]>>('/api/formations')
    return response.data.data
  }

  /**
   * GET - Retrieve single formation by ID
   */
  async getFormationById(id: string): Promise<Formation> {
    const response = await api.get<ApiResponse<Formation>>(
      `/api/formations/${id}`,
    )
    return response.data.data
  }

  /**
   * POST - Create new formation
   */
  async createFormation(
    data: CreateFormationData,
  ): Promise<{ formation: Formation; message: string }> {
    try {
      // Create FormData for file upload
      const formData = new FormData()

      // Append all data fields
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof CreateFormationData]

        // Handle target_skills specially - convert null to empty array
        if (key === 'target_skills') {
          const skills = value as string[] | null
          if (skills && skills.length > 0) {
            // If there are skills, append each one
            skills.forEach((skill) => {
              formData.append('target_skills[]', skill)
            })
          } else {
            // If null or empty, send empty array
            formData.append('target_skills', JSON.stringify([]))
          }
        } else if (value !== undefined && value !== null) {
          // Handle file uploads specially
          if (key === 'image_url' && value instanceof File) {
            formData.append('image_url', value)
          } else if (key !== 'image_url') {
            formData.append(key, value as string | Blob)
          }
        }
      })

      const response = await api.post<ApiResponse<Formation>>(
        '/api/formations',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return {
        formation: response.data.data,
        message: response.data.message,
      }
    } catch (error: any) {
      // Extract and rethrow errors with validation details
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message || 'Erreur lors de la création',
        )
        err.errors = error.response.data.errors
        throw err
      }
      throw error
    }
  }

  /**
   * PUT - Update formation
   */
  async updateFormation(
    id: string,
    data: UpdateFormationData,
  ): Promise<{ formation: Formation; message: string }> {
    try {
      // Create FormData for file upload
      const formData = new FormData()

      // Append all data fields
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof UpdateFormationData]

        // Handle target_skills specially - convert null to empty array
        if (key === 'target_skills') {
          const skills = value as string[] | null | undefined
          if (skills && skills.length > 0) {
            // If there are skills, append each one
            skills.forEach((skill) => {
              formData.append('target_skills[]', skill)
            })
          } else if (skills !== undefined) {
            // If explicitly set to null or empty array, send empty array
            formData.append('target_skills', JSON.stringify([]))
          }
          // If undefined, don't send it at all (for partial updates)
        } else if (value !== undefined && value !== null) {
          // Handle file uploads specially
          if (key === 'image_url' && value instanceof File) {
            formData.append('image_url', value)
          } else if (key !== 'image_url') {
            formData.append(key, value as string | Blob)
          }
        }
      })

      const response = await api.post<ApiResponse<Formation>>(
        `/api/formations/${id}?_method=PUT`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return {
        formation: response.data.data,
        message: response.data.message,
      }
    } catch (error: any) {
      // Extract and rethrow errors with validation details
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message || 'Erreur lors de la mise à jour',
        )
        err.errors = error.response.data.errors
        throw err
      }
      throw error
    }
  }

  /**
   * DELETE - Delete formation
   */
  async deleteFormation(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<ApiResponse<null>>(
        `/api/formations/${id}`,
      )

      return {
        message: response.data.message,
      }
    } catch (error: any) {
      // Extract and rethrow errors
      if (error.response?.data) {
        const err: any = new Error(
          error.response.data.message || 'Erreur lors de la suppression',
        )
        err.errors = error.response.data.errors
        throw err
      }
      throw error
    }
  }
}

export const formationService = new FormationService()
