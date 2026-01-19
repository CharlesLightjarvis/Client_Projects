import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { Outlet, useMatches } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import React, { useMemo } from 'react'

export const Route = createFileRoute('/_protected')({
  component: ProtectedRouteComponent,
  beforeLoad: async ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    if (
      !context.role ||
      (context.role !== 'admin' && context.role !== 'client')
    ) {
      console.error('🚨 Security: Invalid role detected, forcing logout')
      context.logout()
      throw redirect({
        to: '/login',
      })
    }
  },
})

function ProtectedRouteComponent() {
  const matches = useMatches()
  const { role } = Route.useRouteContext()

  // Generate breadcrumb from current route
  const breadcrumbs = useMemo(() => {
    const currentRoute = matches[matches.length - 1]
    const pathname = currentRoute?.pathname || ''

    const parts = pathname.split('/').filter(Boolean)

    if (parts.length === 0) return []

    // Skip the first part if it's the role (admin/client)
    const startIndex = parts[0] === 'admin' || parts[0] === 'client' ? 1 : 0
    const relevantParts = parts.slice(startIndex)

    const crumbs = relevantParts.map((part, index) => {
      const allParts = parts.slice(0, startIndex + index + 1)
      const path = '/' + allParts.join('/')
      // Capitalize and replace hyphens with spaces
      const label = part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      return { label, path, isLast: index === relevantParts.length - 1 }
    })

    return crumbs
  }, [matches])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-sm bg-background/75 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link
                        to={
                          role === 'admin'
                            ? '/admin/dashboard'
                            : '/client/dashboard'
                        }
                      >
                        {role === 'admin' ? 'Administration' : 'Espace Client'}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((crumb) => (
                    <React.Fragment key={crumb.path}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem key={crumb.path}>
                        {crumb.isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
