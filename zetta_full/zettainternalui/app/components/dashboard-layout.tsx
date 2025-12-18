import { Navigate, Outlet, useLocation } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { ModeToggle } from "~/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useAuth } from "~/hooks/use-auth";
import BellNotifications from "./bell-notifications";
import Forbidden from "./errors/forbidden";

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Extraire le rôle de l'URL (admin, teacher ou student)
  const urlRole = location.pathname.split("/")[1];

  // Vérifier si l'utilisateur a le bon rôle pour accéder à cette section
  if (!user || user.role !== urlRole) {
    return <Forbidden />;
  }

  // Déterminer le contenu spécifique au rôle
  const getRoleSpecificContent = () => {
    switch (user.role) {
      case "admin":
        return (
          <div className="flex-1">
            <Outlet />
          </div>
        );
      case "teacher":
        return (
          <div className="flex-1">
            <Outlet />
          </div>
        );
      case "student":
        return (
          <div className="flex-1">
            <Outlet />
          </div>
        );
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
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
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <BellNotifications />
              <ModeToggle />
            </div>
          </div>
        </header>
        {getRoleSpecificContent()}
      </SidebarInset>
    </SidebarProvider>
  );
}
