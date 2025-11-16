import api from '@/lib/api'
import type {
  Module,
  CreateModuleData,
  UpdateModuleData,
  ApiResponse,
} from '@/types/module'

class ModuleService {
  /**
   * GET - Retrieve all modules
   */
  async getAllModules(): Promise<Module[]> {
    const response = await api.get<ApiResponse<Module[]>>('/api/modules')
    return response.data.data
  }

  /**
   * GET - Retrieve single module by ID
   */
  async getModuleById(id: string): Promise<Module> {
    const response = await api.get<ApiResponse<Module>>(`/api/modules/${id}`)
    return response.data.data
  }

  /**
   * POST - Create new module
   */
  async createModule(
    data: CreateModuleData,
  ): Promise<{ module: Module; message: string }> {
    try {
      const response = await api.post<ApiResponse<Module>>('/api/modules', data)

      return {
        module: response.data.data,
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
   * PUT - Update module
   */
  async updateModule(
    id: string,
    data: UpdateModuleData,
  ): Promise<{ module: Module; message: string }> {
    try {
      const response = await api.put<ApiResponse<Module>>(
        `/api/modules/${id}`,
        data,
      )

      return {
        module: response.data.data,
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
   * DELETE - Delete module
   */
  async deleteModule(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/api/modules/${id}`)

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

export const moduleService = new ModuleService()
