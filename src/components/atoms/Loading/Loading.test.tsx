import { render } from '@testing-library/react'
import { Loading } from './Loading'

describe('Loading', () => {
  it('renders with default size (md)', () => {
    render(<Loading />)
    const svg = document.querySelector('svg')!
    expect(svg.getAttribute('class') || '').toContain('w-8 h-8')
  })

  it('renders with sm size', () => {
    render(<Loading size="sm" />)
    const svg = document.querySelector('svg')!
    expect(svg.getAttribute('class') || '').toContain('w-4 h-4')
  })

  it('renders with lg size', () => {
    render(<Loading size="lg" className="extra" />)
    const svg = document.querySelector('svg')!
    expect(svg.getAttribute('class') || '').toContain('w-12 h-12')
    // wrapper should include provided className
    const wrapper = svg.parentElement!
    expect(wrapper.className).toContain('extra')
  })
})
