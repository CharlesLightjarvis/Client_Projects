import { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { useRouterContextState } from './lib/router-context-state.tsx'
import { NotFound404 } from './components/errors/404.tsx'
import { useAuthStore } from './stores/auth-store'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    role: null,
    user: null,
    logout: () => {},
    isAdmin: false,
    isClient: false,
    isAuthenticated: false,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound404,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// App wrapper component to use hooks
function App() {
  const routerContextState = useRouterContextState()
  const fetchUser = useAuthStore((state) => state.fetchUser)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize user session before router starts
  useEffect(() => {
    fetchUser().finally(() => {
      setIsInitialized(true)
    })
  }, [])

  if (!isInitialized) {
    return null // or a loading spinner
  }

  return (
    <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
      <RouterProvider router={router} context={routerContextState} />
    </TanStackQueryProvider.Provider>
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
