import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@tanstack/react-router', async () => {
  return {
    createFileRoute: (path: string) => (opts: any) => ({ path, ...opts }),
    Navigate: ({ to }: { to: string }) => <div role="status">Redirecionando para {to}</div>,
  }
})

describe('/ route (index)', () => {
  it('redirects to /home (message in Portuguese)', async () => {
    const { Route } = await import('./index')
    const Cmp = (Route as any).component
    render(<Cmp />)
    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent('Redirecionando para /home')
  })
})
