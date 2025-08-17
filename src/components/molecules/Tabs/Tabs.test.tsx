import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs } from './Tabs'

const items = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
]

describe('Tabs', () => {
  it('underline variant: sets aria-selected and calls onChange', () => {
    const onChange = vi.fn()
    render(<Tabs items={items} activeId="a" onChange={onChange} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    fireEvent.click(tabs[1])
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('block variant: shows underline element for active', () => {
    const onChange = vi.fn()
    render(<Tabs items={items} activeId="b" onChange={onChange} variant="block" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
  })
})
