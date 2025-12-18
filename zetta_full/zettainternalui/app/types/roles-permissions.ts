// Role and Permission Management Types

export interface Permission {
  id: string;
  name: string;
  guard_name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  roles?: Role[];
}

export interface Role {
  id: string;
  name: string;
  guard_name: string;
  description?: string;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface RolesResponse {
  roles: Role[];
}

export interface PermissionsResponse {
  permissions: Permission[];
}

export interface RolePermissionsResponse {
  permissions: Permission[];
}

// Form Data Types
export interface RoleFormData {
  name: string;
  guard_name: string;
  description?: string;
}

export interface PermissionFormData {
  name: string;
  guard_name: string;
  description?: string;
}

// Permission Assignment Types
export interface AssignPermissionsRequest {
  permission_ids: string[];
}

export interface RevokePermissionsRequest {
  permission_ids: string[];
}

export interface SyncPermissionsRequest {
  permission_ids: string[];
}