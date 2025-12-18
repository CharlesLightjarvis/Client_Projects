import * as React from "react";
import { Link, useLocation } from "react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useAuth } from "~/hooks/use-auth";
import { getSecondaryNavItemsByRole } from "~/data/navigation";

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation();
  const user = useAuth((state) => state.user);
  const items = getSecondaryNavItemsByRole(user?.role);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url}>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  className={
                    location.pathname === item.url
                      ? "bg-[rgb(245,129,45)] text-white"
                      : ""
                  }
                >
                  <div>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
