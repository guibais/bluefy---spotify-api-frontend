import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

let currentPathname = '/'
let currentSearch = ''

let lastNavigateProps: any = null

vi.mock('@tanstack/react-router', () => {
  return {
    createRootRouteWithContext: () => (opts: any) => opts,
    useLocation: () => ({ pathname: currentPathname }),
    Navigate: (props: any) => {
      lastNavigateProps = props
      const searchStr = typeof props.search === 'object' ? JSON.stringify(props.search) : String(props.search)
      return (
        <div role="status" data-to={props.to} data-search={searchStr}>
          navigate
        </div>
      )
    },
    Outlet: () => <div role="region">outlet</div>,
  }
})

vi.mock('@tanstack/react-devtools', () => ({
  TanstackDevtools: ({ children }: any) => <>{children}</>,
}))
vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => <div />,
}))
vi.mock('../integrations/tanstack-query/devtools', () => ({
  default: { name: 'query', render: <div /> },
}))

vi.mock('@/components/organisms', () => ({
  DesktopHeader: ({ isAuthenticated, onLogout }: any) => (
    <header role="banner" data-auth={String(!!isAuthenticated)}>
      header
      <button type="button" onClick={onLogout}>logout</button>
    </header>
  ),
}))

const clearTokensMock = vi.fn()
let authed = false
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: authed, clearTokens: clearTokensMock }),
}))

import { Route } from './__root'

const originalLocation = window.location

describe('__root route guards', () => {
  beforeEach(() => {
    lastNavigateProps = null
    authed = false
    currentPathname = '/'
    currentSearch = ''
    delete (window as any).location
    ;(window as any).location = { ...originalLocation, search: currentSearch, reload: vi.fn() }
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      configurable: true,
    })
  })

  it('redirects unauthenticated users to /login preserving from with locale in path', async () => {
    authed = false
    currentPathname = '/pt-BR/home'
    currentSearch = '?q=1'
    ;(window as any).location = { ...originalLocation, search: currentSearch }

    const Cmp = (Route as any).component
    render(<Cmp />)

    const status = await screen.findByRole('status')
    expect(status).toHaveAttribute('data-to', '/login')
    const parsed = JSON.parse(status.getAttribute('data-search') || '{}')
    expect(parsed.from).toBe('/pt-BR/home?q=1')
  })

  it('renders content (no redirect) on /callback when unauthenticated', () => {
    authed = false
    currentPathname = '/callback'

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(screen.getByRole('region')).toHaveTextContent('outlet')
    expect(screen.getByRole('banner') || screen.getByText('header')).toBeTruthy()
    expect(lastNavigateProps).toBeNull()
  })

  it('redirects authenticated users away from /login to /home', () => {
    authed = true
    currentPathname = '/login'

    const Cmp = (Route as any).component
    render(<Cmp />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('data-to', '/home')
  })

  it('does not redirect on /login when unauthenticated', () => {
    authed = false
    currentPathname = '/login'

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(screen.getByRole('region')).toHaveTextContent('outlet')
    expect(lastNavigateProps).toBeNull()
  })

  it('handles logout: clears tokens and reloads page', () => {
    authed = true
    currentPathname = '/home'

    const Cmp = (Route as any).component
    render(<Cmp />)

    screen.getByRole('button', { name: 'logout' }).click()

    expect(clearTokensMock).toHaveBeenCalled()
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('redirects unauthenticated users from root path "/"', () => {
    authed = false
    currentPathname = '/'

    const Cmp = (Route as any).component
    render(<Cmp />)

    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('data-to', '/login')
    const parsed = JSON.parse(status.getAttribute('data-search') || '{}')
    expect(parsed.from).toBe('/')
  })

})
