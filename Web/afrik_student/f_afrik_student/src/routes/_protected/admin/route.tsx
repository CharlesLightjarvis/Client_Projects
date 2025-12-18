import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin')({
  // component: () => <Outlet />,
  beforeLoad: async ({ context, location }) => {
    if (!context.isAdmin) {
      // Si c'est un instructor valide, le renvoyer à son espace
      if (context.isInstructor) {
        throw redirect({ to: '/instructor' })
      }
      // Si c'est un student valide, le renvoyer à son espace
      if (context.isStudent) {
        throw redirect({ to: '/student' })
      }
      // Sinon, rôle invalide → login
      throw redirect({
        to: '/login',
      })
    }

    // Redirection vers le dashboard
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      throw redirect({
        to: '/admin/dashboard',
      })
    }
  },
})
