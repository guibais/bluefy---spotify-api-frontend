import { render, screen, fireEvent } from '@testing-library/react'
import { DesktopHeader } from './DesktopHeader'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/molecules/NavItem/NavItem', () => ({
  NavItem: ({ to, label }: any) => <a href={to}>{label}</a>,
}))

describe('DesktopHeader', () => {
  it('renders links and hides auth-only items', () => {
    const onLogout = vi.fn()
    render(<DesktopHeader isAuthenticated={false} onLogout={onLogout} />)
    expect(screen.getByRole('link', { name: 'purplefy' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Perfil' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull()
  })

  it('shows profile and logout when authenticated and triggers logout', () => {
    const onLogout = vi.fn()
    render(<DesktopHeader isAuthenticated onLogout={onLogout} />)
    expect(screen.getByRole('link', { name: 'Perfil' })).toBeTruthy()
    const btn = screen.getByRole('button', { name: 'Sair' })
    fireEvent.click(btn)
    expect(onLogout).toHaveBeenCalled()
  })
})
