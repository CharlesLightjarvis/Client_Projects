import { useAuthStore } from '@/stores/auth-store'
import { useMemo } from 'react'

/**
 * Hook to check user permissions
 * @returns Object with permission checking utilities
 */
export function usePermissions() {
  const user = useAuthStore((state) => state.user)

  const permissions = useMemo(
    () => user?.permissions || [],
    [user?.permissions],
  )

  /**
   * Check if user has a specific permission
   * @param permission - Permission string like 'post.create'
   */
  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission)
  }

  /**
   * Check if user has ANY of the specified permissions
   * @param perms - Array of permission strings
   */
  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((perm) => permissions.includes(perm))
  }

  /**
   * Check if user has ALL of the specified permissions
   * @param perms - Array of permission strings
   */
  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every((perm) => permissions.includes(perm))
  }

  /**
   * Check if user can perform CRUD operations on a resource
   */
  const can = {
    create: (resource: string) => hasPermission(`${resource}.create`),
    read: (resource: string) => hasPermission(`${resource}.read`),
    update: (resource: string) => hasPermission(`${resource}.update`),
    delete: (resource: string) => hasPermission(`${resource}.delete`),
    manage: (resource: string) => hasPermission(`${resource}.manage`),
  }

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
  }
}
