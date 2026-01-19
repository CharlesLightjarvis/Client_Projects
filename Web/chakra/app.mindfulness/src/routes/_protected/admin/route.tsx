import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin')({
  // component: () => <Outlet />,
  beforeLoad: async ({ context, location }) => {
    if (!context.isAdmin) {
      // Si c'est un client valide, le renvoyer à son espace
      if (context.isClient) {
        throw redirect({ to: '/client' })
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
