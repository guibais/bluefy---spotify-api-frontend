import { render, screen } from '@testing-library/react'
import { BackLink } from './BackLink'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => <a href={to} className={className}>{children}</a>,
}))

describe('BackLink', () => {
  it('renders anchor with icon and label', () => {
    render(<BackLink to="/x" label="Voltar" />)
    const link = screen.getByRole('link', { name: 'Voltar' })
    expect(link).toBeTruthy()
    const svg = link.querySelector('svg')
    expect(svg).toBeTruthy()
  })
})
