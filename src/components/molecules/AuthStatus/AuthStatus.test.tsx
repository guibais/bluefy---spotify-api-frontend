import { render, screen } from '@testing-library/react'
import { AuthStatus } from './AuthStatus'

describe('AuthStatus', () => {
  it('renders processing state', () => {
    render(<AuthStatus status="processing" />)
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
  })

  it('renders success state', () => {
    render(<AuthStatus status="success" />)
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('✅')).toBeTruthy()
  })

  it('renders error state with action', () => {
    render(<AuthStatus status="error" errorMessage="Oops" action={<button>Retry</button>} />)
    expect(screen.getByText('Oops')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy()
  })
})
