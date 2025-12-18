import { api } from "../../api";
import type {
  Role,
  Permission,
  ApiResponse,
  RolesResponse,
  PermissionsResponse,
  RolePermissionsResponse,
  RoleFormData,
  PermissionFormData,
  AssignPermissionsRequest,
  RevokePermissionsRequest,
  SyncPermissionsRequest,
} from "../../types/roles-permissions";

// Enhanced error handling for API responses
class ApiError extends Error {
  constructor(
    message: string,
    public errors?: Record<string, string[]>,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Helper function to handle API responses and errors
function handleApiResponse<T>(response: {
  data: ApiResponse<T>;
  status?: number;
}): T {
  if (!response.data.success) {
    throw new ApiError(
      response.data.message || "API request failed",
      response.data.errors,
      response.status
    );
  }

  if (!response.data.data) {
    throw new ApiError("No data received from server");
  }

  return response.data.data;
}

// Helper function to handle API errors from axios
function handleApiError(error: any): never {
  if (error.response?.data) {
    const apiResponse = error.response.data as ApiResponse<any>;
    throw new ApiError(
      apiResponse.message || "API request failed",
      apiResponse.errors,
      error.response.status
    );
  }

  if (error.message) {
    throw new ApiError(error.message);
  }

  throw new ApiError("An unexpected error occurred");
}

// Roles API Functions
export const rolesApi = {
  // Get all roles
  async getAll(): Promise<Role[]> {
    try {
      const response = await api.get<ApiResponse<RolesResponse>>(
        "/api/v1/admin/roles"
      );
      const data = handleApiResponse(response);
      return data.roles || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get a single role by ID
  async getById(id: string): Promise<Role> {
    try {
      const response = await api.get<ApiResponse<{ role: Role }>>(
        `/api/v1/admin/roles/${id}`
      );
      const data = handleApiResponse(response);
      return data.role;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Create a new role
  async create(data: RoleFormData): Promise<Role> {
    try {
      const response = await api.post<ApiResponse<{ role: Role }>>(
        "/api/v1/admin/roles",
        data
      );
      const responseData = handleApiResponse(response);
      return responseData.role;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update an existing role
  async update(id: string, data: RoleFormData): Promise<Role> {
    try {
      const response = await api.put<ApiResponse<{ role: Role }>>(
        `/api/v1/admin/roles/${id}`,
        data
      );
      const responseData = handleApiResponse(response);
      return responseData.role;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete a role
  async delete(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<{}>>(
        `/api/v1/admin/roles/${id}`
      );
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Permissions API Functions
export const permissionsApi = {
  // Get all permissions
  async getAll(): Promise<Permission[]> {
    try {
      const response = await api.get<ApiResponse<PermissionsResponse>>(
        "/api/v1/admin/permissions"
      );
      const data = handleApiResponse(response);
      return data.permissions || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get a single permission by ID
  async getById(id: string): Promise<Permission> {
    try {
      const response = await api.get<ApiResponse<{ permission: Permission }>>(
        `/api/v1/admin/permissions/${id}`
      );
      const data = handleApiResponse(response);
      return data.permission;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Create a new permission
  async create(data: PermissionFormData): Promise<Permission> {
    try {
      const response = await api.post<ApiResponse<{ permission: Permission }>>(
        "/api/v1/admin/permissions",
        data
      );
      const responseData = handleApiResponse(response);
      return responseData.permission;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update an existing permission
  async update(id: string, data: PermissionFormData): Promise<Permission> {
    try {
      const response = await api.put<ApiResponse<{ permission: Permission }>>(
        `/api/v1/admin/permissions/${id}`,
        data
      );
      const responseData = handleApiResponse(response);
      return responseData.permission;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete a permission
  async delete(id: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<{}>>(
        `/api/v1/admin/permissions/${id}`
      );
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Role-Permission Assignment API Functions
export const rolePermissionsApi = {
  // Get permissions for a specific role
  async getRolePermissions(roleId: string): Promise<Permission[]> {
    try {
      const response = await api.get<ApiResponse<RolePermissionsResponse>>(
        `/api/v1/admin/roles/${roleId}/permissions`
      );
      const data = handleApiResponse(response);
      return data.permissions || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  // Assign permissions to a role
  async assignPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<void> {
    try {
      const data: AssignPermissionsRequest = { permission_ids: permissionIds };
      const response = await api.post<ApiResponse<{}>>(
        `/api/v1/admin/roles/${roleId}/permissions/assign`,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Revoke permissions from a role
  async revokePermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<void> {
    try {
      const data: RevokePermissionsRequest = { permission_ids: permissionIds };
      const response = await api.post<ApiResponse<{}>>(
        `/api/v1/admin/roles/${roleId}/permissions/revoke`,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Sync permissions for a role (replace all existing permissions)
  async syncPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<void> {
    try {
      const data: SyncPermissionsRequest = { permission_ids: permissionIds };
      const response = await api.post<ApiResponse<{}>>(
        `/api/v1/admin/roles/${roleId}/permissions/sync`,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Combined export for convenience
export const rolesPermissionsApi = {
  roles: rolesApi,
  permissions: permissionsApi,
  rolePermissions: rolePermissionsApi,
};
