import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/student/formations/$formationId/lessons',
)({
  component: () => <Outlet />,
})
