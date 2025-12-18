import type { Route } from "./+types/home";

import { Navigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  // Redirect to login
  return <Navigate to="/login" replace />;
}
