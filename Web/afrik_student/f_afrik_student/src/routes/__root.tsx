import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

// import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'

// interface MyRouterContext {
//   queryClient: QueryClient
// }

import type { User } from '@/types/user'

export type UserRole = 'admin' | 'instructor' | 'student' | null
export type RouterContext = {
  role: UserRole
  user: User | null
  logout: () => void
  isAdmin: boolean
  isInstructor: boolean
  isStudent: boolean
  isAuthenticated: boolean
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>

      <Toaster position="top-center" richColors />

      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      /> */}
    </>
  ),
})
