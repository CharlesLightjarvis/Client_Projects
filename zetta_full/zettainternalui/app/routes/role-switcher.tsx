import { Button } from "~/components/ui/button";
import { useAuth, quickLogin } from "~/hooks/use-auth";

export function RoleSwitcher() {
  const logout = useAuth((state) => state.logout);
  const currentUser = useAuth((state) => state.user);

  return (
    <div className="flex items-center gap-2 p-2">
      <span className="text-sm font-medium">
        Current Role: {currentUser?.role || "none"}
      </span>
      <Button variant="outline" size="sm" onClick={() => quickLogin("admin")}>
        Login as Admin
      </Button>
      <Button variant="outline" size="sm" onClick={() => quickLogin("teacher")}>
        Login as Teacher
      </Button>
      <Button variant="outline" size="sm" onClick={() => quickLogin("student")}>
        Login as Student
      </Button>
      <Button variant="outline" size="sm" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
