import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('renders label and error', () => {
    render(<Input label="Name" error="Required" />)
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Required')).toBeTruthy()
  })

  it('shows search icon when showSearch', () => {
    render(<Input showSearch aria-label="search" />)
    // lucide icon has no role; ensure the input has left padding class applied
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('pl-10')
  })

  it('renders clear button when value and onClear provided', () => {
    const onClear = vi.fn()
    render(<Input value="abc" onClear={onClear} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(onClear).toHaveBeenCalled()
  })

  it('forwards value and other props', () => {
    render(<Input value="hello" placeholder="type here" />)
    const input = screen.getByPlaceholderText('type here') as HTMLInputElement
    expect(input.value).toBe('hello')
  })
})
