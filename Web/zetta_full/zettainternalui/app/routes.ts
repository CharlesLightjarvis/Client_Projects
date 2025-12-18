import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // login route
  index("routes/home.tsx"),

  route("login", "./routes/auth/login.tsx"),

  layout("./components/dashboard-layout.tsx", [
    // student routes
    ...prefix("student/dashboard", [
      index("./routes/student/home.tsx"),
      route(
        "certifications",
        "./routes/student/certifications/certifications-list.tsx"
      ),
      route(
        "certifications/:id",
        "./routes/student/certifications/certification-details.tsx"
      ),
      route(
        "certifications/:id/certification-mode",
        "./routes/student/certifications/certification-mode.tsx"
      ),
      route(
        "certifications/:id/exam/:mode",
        "./routes/student/certifications/certification-exam.tsx"
      ),
      route(
        "certifications/:id/results/:attemptNumber",
        "./routes/student/certifications/certification-result.tsx"
      ),

      // formations
      route("formations", "./routes/student/formations/formations-list.tsx"),
      route(
        "formations/:id",
        "./routes/student/formations/formation-details.tsx"
      ),

      // paiements
      route("payments", "./routes/student/paiements/paiements-list.tsx"),
      
    ]),

    // teacher routes
    ...prefix("teacher/dashboard", [
      index("./routes/teacher/home.tsx"),
      route("sessions", "./routes/teacher/sessions/sessions-list.tsx"),
      route("attendances", "./routes/teacher/attendances/attendance-list.tsx"),
      route("resources", "./routes/teacher/resources/resource-manager.tsx"),
    ]),

    // admin routes
    ...prefix("admin/dashboard", [
      index("./routes/admin/home.tsx"),
      route(
        "notifications",
        "./routes/admin/notifications/notification-page.tsx"
      ),
      route("users", "./routes/admin/users/users-list.tsx"),
      route("categories", "./routes/admin/categories/categories-list.tsx"),
      route("formations", "./routes/admin/formations/formations-list.tsx"),
      route(
        "certifications",
        "./routes/admin/certifications/certifications-list.tsx"
      ),
      route("sessions", "./routes/admin/sessions/sessions-list.tsx"),
      route("modules", "./routes/admin/modules/modules-list.tsx"),
      route("lessons", "./routes/admin/lessons/lessons-list.tsx"),
      route("payments", "./routes/admin/payments/payments-list.tsx"),
      route("quiz", "./routes/admin/quiz/quiz-management.tsx"),
      route("schedules", "./routes/admin/quiz/schedule-viewer.tsx"),
      route("chat", "./routes/admin/chat-interface.tsx"),
      route(
        "rolespermissions",
        "./routes/admin/roles-permissions.tsx"
      ),
      route(
        "profile",
        "./routes/admin/profile.tsx"
      ),
    ]),
  ]),
] satisfies RouteConfig;
