import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@tanstack/react-router', async () => {
  return {
    // Devolve um objeto simples com o component para fácil renderização
    createFileRoute: (path: string) => (opts: any) => ({ path, ...opts }),
    Navigate: ({ to }: { to: string }) => <div role="status">Redirecionando para {to}</div>,
  }
})

describe('/ route (index)', () => {
  it('redireciona para /home (mensagem em português)', async () => {
    const { Route } = await import('./index')
    const Cmp = (Route as any).component
    render(<Cmp />)
    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent('Redirecionando para /home')
  })
})
