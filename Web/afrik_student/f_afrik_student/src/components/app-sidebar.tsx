'use client'

import * as React from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import { useRouteContext } from '@tanstack/react-router'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { navigationMain, navigationProjects } from '@/config/navigation'
import type { RouterContext } from '@/routes/__root'

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const context = useRouteContext({ from: '__root__' }) as RouterContext
  const { role } = context

  // Filter navigation items based on user role
  const filteredNavMain = React.useMemo(() => {
    if (!role) return []
    return navigationMain
      .filter((item) => item.allowedRoles.includes(role))
      .map((item) => ({
        ...item,
        items: item.items?.filter((subItem) =>
          subItem.allowedRoles.includes(role),
        ),
      }))
  }, [role])

  const filteredNavProjects = React.useMemo(() => {
    if (!role) return []
    return navigationProjects.filter((project) =>
      project.allowedRoles.includes(role),
    )
  }, [role])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={filteredNavProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
