import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import * as TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'
import { render } from '@testing-library/react'

export const renderAt = (path: string) => {
  const ctx = TanStackQueryProvider.getContext()
  window.history.pushState({}, '', path)
  const router = createRouter({
    routeTree,
    context: { ...ctx },
    defaultPreload: false,
    scrollRestoration: false,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    basepath: '/',
  })
  if (typeof router.navigate === 'function') {
    router.navigate({ to: path }).catch(() => {})
  }
  return render(
    <TanStackQueryProvider.Provider {...ctx}>
      <RouterProvider router={router} />
    </TanStackQueryProvider.Provider>
  )
}
