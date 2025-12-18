import * as React from "react";
import { Users, GraduationCap, BookOpen, Shield, School } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { TeamSwitcher } from "~/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { useAuth } from "~/hooks/use-auth";
import { NavSecondary } from "./nav-secondary";

const getRoleData = (role?: string) => {
  switch (role) {
    case "admin":
      return {
        name: "Administration",
        logo: Shield,
        plan: "Full Access",
      };
    case "teacher":
      return {
        name: "Faculty",
        logo: GraduationCap,
        plan: "Teacher Access",
      };
    case "student":
      return {
        name: "Student Portal",
        logo: BookOpen,
        plan: "Student Access",
      };
    default:
      return {
        name: "Guest Access",
        logo: Users,
        plan: "Limited Access",
      };
  }
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuth((state) => state.user);
  const roleData = getRoleData(user?.role);

  const userData = user
    ? {
        name: user.fullName,
        email: user.email,
        avatar: user.imageUrl || "/avatars/default.jpg",
      }
    : {
        name: "Guest",
        email: "guest@example.com",
        avatar: "/avatars/default.jpg",
      };

  // On n'a besoin que d'une seule "team" basée sur le rôle
  const teams = [roleData];

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
