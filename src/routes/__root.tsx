import { Outlet, createRootRouteWithContext, Navigate, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { useAuth } from '@/hooks/useAuth'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { DesktopHeader } from '@/components/organisms'

type MyRouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const { isAuthenticated, clearTokens } = useAuth()
    const location = useLocation()
    const path = location.pathname
    const segments = path.split('/').filter(Boolean)
    const localeRegex = /^[a-z]{2}(?:-[A-Z]{2})?$/
    const hasLocale = segments.length > 0 && localeRegex.test(segments[0] ?? '')
    const basePath = `/${hasLocale ? segments.slice(1).join('/') : segments.join('/')}` || '/'
    if (!isAuthenticated && basePath !== '/login' && basePath !== '/callback') {
      const searchStr = typeof window !== 'undefined' ? window.location.search : ''
      return (
        <Navigate
          to="/login"  
          search={{ from: `${path}${searchStr}` }}
        />
      )
    }
    if (isAuthenticated && basePath === '/login') {
      return <Navigate to="/home" />
    }
    
    const handleLogout = () => {
      clearTokens()
      window.location.reload()
    }

    return (
      <>
        <DesktopHeader isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="min-h-screen bg-spotify-black" role="main">
        <Outlet />
      </main>
        {import.meta.env.DEV && (
          <TanstackDevtools
            config={{
              position: 'bottom-left',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        )}
      </>
    )
  },
})
