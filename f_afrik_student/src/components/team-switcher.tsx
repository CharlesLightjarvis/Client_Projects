'use client'

import * as React from 'react'
import { ChevronsUpDown, Shield, User } from 'lucide-react'
import { useRouteContext } from '@tanstack/react-router'
import type { RouterContext } from '@/routes/__root'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const context = useRouteContext({ from: '__root__' }) as RouterContext
  const { role } = context
  const [activeTeam] = React.useState(teams[0])

  const roleConfig = React.useMemo(() => {
    if (role === 'admin') {
      return {
        icon: Shield,
        name: 'Administration',
        plan: 'Compte Administrateur',
      }
    } else if (role === 'client') {
      return {
        icon: User,
        name: 'Espace Client',
        plan: 'Compte Client',
      }
    }
    return {
      icon: activeTeam?.logo || User,
      name: activeTeam?.name || 'Utilisateur',
      plan: activeTeam?.plan || 'Standard',
    }
  }, [role, activeTeam])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <roleConfig.icon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{roleConfig.name}</span>
                <span className="truncate text-xs">{roleConfig.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Rôle actuel
            </DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border">
                <roleConfig.icon className="size-3.5 shrink-0" />
              </div>
              {roleConfig.name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="gap-2 p-2">
              <div className="text-muted-foreground text-xs">
                {roleConfig.plan}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
