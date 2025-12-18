import { useAuth } from "~/hooks/use-auth";
import StudentNotifications from "~/routes/student/student-notifications";
import AdminNotifications from "~/routes/admin/notifications/admin-bell-notifications";
import TeacherNotifications from "~/routes/teacher/teacher-notifications";

export default function BellNotifications() {
  const user = useAuth((state) => state.user);
  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminNotifications />;
      break;

    case "teacher":
      return <TeacherNotifications />;
      break;

    default:
      return <StudentNotifications />;
      break;
  }
}
