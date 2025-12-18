import { usePermissions } from '@/hooks/use-permissions'
import type { ReactNode } from 'react'

interface PermissionGuardProps {
  /** Single permission or array of permissions to check */
  permissions: string | string[]
  /** Match mode: 'any' = user needs at least one permission, 'all' = user needs all permissions */
  mode?: 'any' | 'all'
  /** Content to show when user has permission */
  children: ReactNode
  /** Optional fallback content when user lacks permission */
  fallback?: ReactNode
}

/**
 * Component to conditionally render content based on user permissions
 *
 * @example
 * <PermissionGuard permissions="post.create">
 *   <CreatePostButton />
 * </PermissionGuard>
 *
 * @example
 * <PermissionGuard permissions={['post.update', 'post.delete']} mode="any">
 *   <PostActionsMenu />
 * </PermissionGuard>
 */
export function PermissionGuard({
  permissions: requiredPermissions,
  mode = 'all',
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions()

  const hasAccess = (() => {
    if (typeof requiredPermissions === 'string') {
      return hasPermission(requiredPermissions)
    }

    if (mode === 'any') {
      return hasAnyPermission(requiredPermissions)
    }

    return hasAllPermissions(requiredPermissions)
  })()

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
