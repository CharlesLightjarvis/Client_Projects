import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/student')({
  beforeLoad: async ({ context, location }) => {
    if (!context.isStudent) {
      // Si c'est un admin valide, le renvoyer à son espace
      if (context.isAdmin) {
        throw redirect({ to: '/admin' })
      }
      // Si c'est un instructor valide, le renvoyer à son espace
      if (context.isInstructor) {
        throw redirect({ to: '/instructor' })
      }
      // Sinon, rôle invalide → login
      throw redirect({ to: '/login' })
    }

    // Redirection vers le dashboard
    if (location.pathname === '/student' || location.pathname === '/student/') {
      throw redirect({
        to: '/student/dashboard',
      })
    }
  },
})
