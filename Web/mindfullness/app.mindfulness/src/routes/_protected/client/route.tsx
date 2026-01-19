import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/client')({
  beforeLoad: async ({ context, location }) => {
    if (!context.isClient) {
      // Si c'est un admin valide, le renvoyer à son espace
      if (context.isAdmin) {
        throw redirect({ to: '/admin' })
      }
      // Sinon, rôle invalide → login
      throw redirect({ to: '/login' })
    }

    // Redirection vers le dashboard
    if (location.pathname === '/client' || location.pathname === '/client/') {
      throw redirect({
        to: '/client/dashboard',
      })
    }
  },
})
