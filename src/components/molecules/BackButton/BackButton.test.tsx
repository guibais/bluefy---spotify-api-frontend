import { render, fireEvent } from '@testing-library/react'
import { BackButton } from './BackButton'

vi.mock('@tanstack/react-router', () => ({ useRouter: () => ({ navigate: vi.fn() }) }))

describe('BackButton', () => {
  it('navigates to fallback when no history', () => {
    const original = window.history.length
    Object.defineProperty(window, 'history', { value: { length: 0, back: vi.fn() } })
    const { container } = render(<BackButton fallbackTo="/home" />)
    const btn = container.querySelector('button')!
    fireEvent.click(btn)
    Object.defineProperty(window, 'history', { value: { length: original, back: vi.fn() } })
  })

  it('goes back when there is history', () => {
    const back = vi.fn()
    const original = window.history.length
    Object.defineProperty(window, 'history', { value: { length: 2, back } })
    const { container } = render(<BackButton />)
    const btn = container.querySelector('button')!
    fireEvent.click(btn)
    expect(back).toHaveBeenCalledTimes(1)
    Object.defineProperty(window, 'history', { value: { length: original, back: vi.fn() } })
  })
})
