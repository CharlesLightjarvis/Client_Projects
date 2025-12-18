import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/instructor')({
  beforeLoad: async ({ context, location }) => {
    if (!context.isInstructor) {
      // Si c'est un admin valide, le renvoyer à son espace
      if (context.isAdmin) {
        throw redirect({ to: '/admin' })
      }
      // Si c'est un student valide, le renvoyer à son espace
      if (context.isStudent) {
        throw redirect({ to: '/student' })
      }
      // Sinon, rôle invalide → login
      throw redirect({ to: '/login' })
    }

    // Redirection vers le dashboard
    if (location.pathname === '/instructor' || location.pathname === '/instructor/') {
      throw redirect({
        to: '/instructor/dashboard',
      })
    }
  },
})
