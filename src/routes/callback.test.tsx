import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

let currentSearch: any = {}
const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: (_path: string) => (opts: any) => ({
    ...opts,
    useSearch: () => currentSearch,
  }),
  useNavigate: () => navigateMock,
}))

vi.mock('@/components', () => ({
  BackButton: ({ children }: any) => <button type="button">{children}</button>,
}))

vi.mock('@/components/molecules', () => ({
  AuthStatus: ({ status, errorMessage, action }: any) => (
    <div>
      <h1>{status}</h1>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <div>{action}</div>
    </div>
  ),
}))

vi.mock('@/services/spotifyAuth', () => ({
  spotifyAuth: {
    getToken: vi.fn(),
  },
}))

import { spotifyAuth } from '@/services/spotifyAuth'
import { Route } from './callback'

describe('/callback route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentSearch = {}
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows error when error param is present in URL', async () => {
    currentSearch = { error: 'access_denied' }

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('error')
    expect(screen.getByText(/access_denied/)).toBeInTheDocument()
  })

  it('shows error when code is missing', async () => {
    currentSearch = {}

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('error')
  })

  it('success: navigates to /home when state is empty', async () => {
    currentSearch = { code: 'abc', state: '' }
    vi.mocked(spotifyAuth.getToken as any).mockResolvedValueOnce(undefined)
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout' as any)

    const Cmp = (Route as any).component
    render(<Cmp />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('success')
    })

    let cb: any
    for (let i = setTimeoutSpy.mock.calls.length - 1; i >= 0; i--) {
      const call = setTimeoutSpy.mock.calls[i]
      if (typeof call?.[0] === 'function' && call?.[1] === 2000) {
        cb = call[0]
        break
      }
    }
    if (cb) cb()

    expect(navigateMock).toHaveBeenCalledWith({ to: '/home' })
  })

  it('success: navigates to state when provided', async () => {
    currentSearch = { code: 'abc', state: '/profile' }
    vi.mocked(spotifyAuth.getToken as any).mockResolvedValueOnce(undefined)
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout' as any)

    const Cmp = (Route as any).component
    render(<Cmp />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('success')
    })

    let cb: any
    for (let i = setTimeoutSpy.mock.calls.length - 1; i >= 0; i--) {
      const call = setTimeoutSpy.mock.calls[i]
      if (typeof call?.[0] === 'function' && call?.[1] === 2000) {
        cb = call[0]
        break
      }
    }
    if (cb) cb()

    expect(navigateMock).toHaveBeenCalledWith({ to: '/profile' })
  })

  it('fails to get token: shows error with exception message', async () => {
    currentSearch = { code: 'abc' }
    vi.mocked(spotifyAuth.getToken as any).mockRejectedValueOnce(new Error('boom'))

    const Cmp = (Route as any).component
    render(<Cmp />)

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('error')
    expect(screen.getByText('boom')).toBeInTheDocument()
  })
})
