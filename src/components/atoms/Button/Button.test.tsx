import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'
import { createRef } from 'react'

describe('Button', () => {
  it('renders children and calls onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    const btn = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalled()
  })

  it('applies loading state and disables button', () => {
    render(<Button loading>Load</Button>)
    const btn = screen.getByRole('button', { name: /load/i }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(btn.querySelector('svg')).toBeTruthy()
  })

  it('supports variant, size and fullWidth', () => {
    render(
      <Button variant="secondary" size="lg" fullWidth>
        Wide
      </Button>
    )
    const btn = screen.getByRole('button', { name: /wide/i })
    expect(btn.className).toContain('btn-secondary')
    expect(btn.className).toContain('py-4')
    expect(btn.className).toContain('w-full')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
