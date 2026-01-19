import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

// import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import type { User } from 'types/user'
import { Toaster } from 'sonner'

// interface MyRouterContext {
//   queryClient: QueryClient
// }

export type UserRole = 'admin' | 'client' | null
export type RouterContext = {
  role: UserRole
  user: User | null
  logout: () => void
  isAdmin: boolean
  isClient: boolean
  isAuthenticated: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>

      <Toaster position="top-center" richColors />
    </>
  ),
})
