export type UserRole = "admin" | "teacher" | "student";

export interface User {
  fullName: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export const users: User[] = [
  {
    fullName: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "/avatars/admin.jpg",
  },
  {
    fullName: "Teacher Smith",
    email: "teacher@example.com",
    role: "teacher",
    avatar: "/avatars/teacher.jpg",
  },
  {
    fullName: "Student Doe",
    email: "student@example.com",
    role: "student",
    avatar: "/avatars/student.jpg",
  },
];

// Navigation items per role
export const getNavItemsByRole = (role: UserRole) => {
  const commonItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "Home",
      isActive: true,
    },
  ];

  const adminItems = [
    {
      title: "Users Management",
      url: "/users",
      icon: "Users",
      items: [
        { title: "All Users", url: "/users" },
        { title: "Add User", url: "/users/add" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: "Settings",
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Security", url: "/settings/security" },
      ],
    },
  ];

  const teacherItems = [
    {
      title: "Courses",
      url: "/courses",
      icon: "BookOpen",
      items: [
        { title: "My Courses", url: "/courses" },
        { title: "Create Course", url: "/courses/create" },
      ],
    },
    {
      title: "Students",
      url: "/students",
      icon: "Users",
      items: [
        { title: "My Students", url: "/students" },
        { title: "Grades", url: "/students/grades" },
      ],
    },
  ];

  const studentItems = [
    {
      title: "My Courses",
      url: "/my-courses",
      icon: "BookOpen",
      items: [
        { title: "Active Courses", url: "/my-courses" },
        { title: "Completed", url: "/my-courses/completed" },
      ],
    },
    {
      title: "Grades",
      url: "/grades",
      icon: "Award",
      items: [
        { title: "Current Grades", url: "/grades" },
        { title: "Transcript", url: "/grades/transcript" },
      ],
    },
  ];

  switch (role) {
    case "admin":
      return [...commonItems, ...adminItems];
    case "teacher":
      return [...commonItems, ...teacherItems];
    case "student":
      return [...commonItems, ...studentItems];
    default:
      return commonItems;
  }
};
