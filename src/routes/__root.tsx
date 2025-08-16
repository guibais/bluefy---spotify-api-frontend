import { Outlet, createRootRouteWithContext, Link } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { Music } from 'lucide-react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'

type MyRouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <header className="sticky top-0 z-50 bg-spotify-black/95 backdrop-blur-custom border-b border-spotify-medium-gray">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-spotify-green hover:text-spotify-green-light transition-colors">
              <Music className="w-8 h-8" />
              <span className="text-xl font-bold">Kanastrafy</span>
            </Link>
            
            <nav className="hidden sm:flex items-center gap-6">
              <Link 
                to="/" 
                className="text-spotify-light-gray hover:text-spotify-white transition-colors"
                activeProps={{ className: "text-spotify-green" }}
              >
                Artistas
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="min-h-screen bg-spotify-black">
        <Outlet />
      </main>
      
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
    </>
  ),
})
