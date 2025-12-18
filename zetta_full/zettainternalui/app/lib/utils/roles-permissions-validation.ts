import type { Role, Permission } from "~/types/roles-permissions";

// Check if role name already exists (case-insensitive)
export function isRoleNameDuplicate(
  name: string, 
  existingRoles: Role[], 
  excludeId?: string
): boolean {
  return existingRoles.some(role => 
    role.id !== excludeId && 
    role.name.toLowerCase() === name.toLowerCase()
  );
}

// Check if permission name already exists (case-insensitive)
export function isPermissionNameDuplicate(
  name: string, 
  existingPermissions: Permission[], 
  excludeId?: string
): boolean {
  return existingPermissions.some(permission => 
    permission.id !== excludeId && 
    permission.name.toLowerCase() === name.toLowerCase()
  );
}

// Validate role name format
export function validateRoleName(name: string): string | null {
  if (!name.trim()) {
    return "Role name is required";
  }
  
  if (name.length < 2) {
    return "Role name must be at least 2 characters long";
  }
  
  if (name.length > 255) {
    return "Role name must be less than 255 characters";
  }
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
    return "Role name can only contain letters, numbers, spaces, hyphens, and underscores";
  }
  
  return null;
}

// Validate permission name format
export function validatePermissionName(name: string): string | null {
  if (!name.trim()) {
    return "Permission name is required";
  }
  
  if (name.length < 2) {
    return "Permission name must be at least 2 characters long";
  }
  
  if (name.length > 255) {
    return "Permission name must be less than 255 characters";
  }
  
  if (!/^[a-zA-Z0-9\s\-_\.]+$/.test(name)) {
    return "Permission name can only contain letters, numbers, spaces, hyphens, underscores, and dots";
  }
  
  return null;
}

// Validate guard name
export function validateGuardName(guardName: string): string | null {
  if (!guardName.trim()) {
    return "Guard name is required";
  }
  
  if (guardName.length > 255) {
    return "Guard name must be less than 255 characters";
  }
  
  if (!/^[a-zA-Z0-9\-_]+$/.test(guardName)) {
    return "Guard name can only contain letters, numbers, hyphens, and underscores";
  }
  
  return null;
}

// Validate description
export function validateDescription(description?: string): string | null {
  if (description && description.length > 1000) {
    return "Description must be less than 1000 characters";
  }
  
  return null;
}

// Get role usage count (how many users have this role)
export function getRoleUsageInfo(role: Role): string {
  const permissionCount = role.permissions.length;
  if (permissionCount === 0) {
    return "No permissions assigned";
  }
  return `${permissionCount} permission${permissionCount === 1 ? '' : 's'} assigned`;
}

// Get permission usage count (how many roles have this permission)
export function getPermissionUsageInfo(permission: Permission, roles: Role[]): string {
  const roleCount = roles.filter(role => 
    role.permissions.some(p => p.id === permission.id)
  ).length;
  
  if (roleCount === 0) {
    return "Not used by any roles";
  }
  return `Used by ${roleCount} role${roleCount === 1 ? '' : 's'}`;
}

// Check if role can be safely deleted
export function canDeleteRole(role: Role): { canDelete: boolean; reason?: string } {
  // Add any business logic for role deletion restrictions
  // For example, prevent deletion of system roles
  const systemRoles = ['admin', 'super-admin', 'system'];
  
  if (systemRoles.includes(role.name.toLowerCase())) {
    return {
      canDelete: false,
      reason: "System roles cannot be deleted"
    };
  }
  
  return { canDelete: true };
}

// Check if permission can be safely deleted
export function canDeletePermission(permission: Permission, roles: Role[]): { canDelete: boolean; reason?: string } {
  const rolesUsingPermission = roles.filter(role => 
    role.permissions.some(p => p.id === permission.id)
  );
  
  if (rolesUsingPermission.length > 0) {
    return {
      canDelete: false,
      reason: `Permission is used by ${rolesUsingPermission.length} role(s). Remove it from all roles first.`
    };
  }
  
  return { canDelete: true };
}

// Format role name for display
export function formatRoleName(name: string): string {
  return name
    .split(/[\s\-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Format permission name for display
export function formatPermissionName(name: string): string {
  return name
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' › ');
}