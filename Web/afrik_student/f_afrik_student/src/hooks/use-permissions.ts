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
   * Backend format: create.users, read.posts, etc. (action.resource)
   */
  const can = {
    create: (resource: string) => {
      const pluralResource = resource.endsWith('s') ? resource : `${resource}s`
      return hasPermission(`create.${pluralResource}`)
    },
    read: (resource: string) => {
      const pluralResource = resource.endsWith('s') ? resource : `${resource}s`
      return hasPermission(`read.${pluralResource}`)
    },
    update: (resource: string) => {
      const pluralResource = resource.endsWith('s') ? resource : `${resource}s`
      return hasPermission(`update.${pluralResource}`)
    },
    delete: (resource: string) => {
      const pluralResource = resource.endsWith('s') ? resource : `${resource}s`
      return hasPermission(`delete.${pluralResource}`)
    },
    manage: (resource: string) => {
      const pluralResource = resource.endsWith('s') ? resource : `${resource}s`
      return hasPermission(`manage.${pluralResource}`)
    },
  }

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
  }
}
