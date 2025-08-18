import React from 'react'
import type { Decorator } from '@storybook/react'
import { RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

export const withRouter: Decorator = (Story) => {
  const RootRoute = createRootRoute({
    component: () => <Story />,
  })

  const IndexRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: '/',
  })

  const HomeRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: '/home',
  })

  const SearchRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: '/search',
  })

  const ProfileRoute = createRoute({
    getParentRoute: () => RootRoute,
    path: '/profile',
  })

  const routeTree = RootRoute.addChildren([IndexRoute, HomeRoute, SearchRoute, ProfileRoute])
  const router = createRouter({ routeTree }) as unknown as any

  return <RouterProvider router={router} />
}
