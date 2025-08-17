import { Outlet, createRootRouteWithContext, Link, Navigate, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { Music, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import * as m from '@/paraglide/messages.js'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'

type MyRouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const { isAuthenticated, clearTokens } = useAuth()
    const location = useLocation()
    const path = location.pathname
    if (!isAuthenticated && path !== '/login' && path !== '/callback') {
      const searchStr = typeof window !== 'undefined' ? window.location.search : ''
      return (
        <Navigate
          to="/login"
          search={{ from: `${path}${searchStr}` }}
        />
      )
    }
    if (isAuthenticated && path === '/login') {
      return <Navigate to="/home" />
    }
    
    const handleLogout = () => {
      clearTokens()
      window.location.reload()
    }

    return (
      <>
        <header className="hidden md:block sticky top-0 z-50 bg-spotify-black/95 backdrop-blur-custom border-b border-spotify-medium-gray">
          <div className="container">
            <div className="flex items-center justify-between h-16">
              <Link to="/home" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors">
                <Music className="w-8 h-8" />
                <span className="text-xl font-bold">purplefy</span>
              </Link>
              
              <nav className="flex items-center gap-6" aria-label={m.primary_navigation_label()}>
                   <Link 
                  to="/home" 
                  className="text-spotify-light-gray hover:text-spotify-white transition-colors"
                  activeProps={{ className: "text-blue-500" }}
                >
                  {m.nav_home()}
                </Link>
                <Link 
                  to="/search" 
                  className="text-spotify-light-gray hover:text-spotify-white transition-colors"
                  activeProps={{ className: "text-blue-500" }}
                >
                  {m.nav_search()}
                </Link>
                {isAuthenticated && (
                  <Link 
                    to="/profile" 
                    className="text-spotify-light-gray hover:text-spotify-white transition-colors"
                    activeProps={{ className: "text-blue-500" }}
                  >
                    {m.nav_profile()}
                  </Link>
                )}
                
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-spotify-light-gray hover:text-spotify-white transition-colors"
                    aria-label={m.nav_logout()}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">{m.nav_logout()}</span>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </header>
      
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
