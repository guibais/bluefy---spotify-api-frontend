import { render, screen, fireEvent } from '@testing-library/react'
import { Image } from './Image'

describe('Image', () => {
  it('renders skeleton while loading then shows image', () => {
    render(<Image src="/img.png" alt="pic" className="w-10 h-10" />)
    const skeleton = document.querySelector('.skeleton')
    expect(skeleton).toBeTruthy()
    const img = screen.getByRole('img', { name: /pic/i }) as HTMLImageElement
    fireEvent.load(img)
    expect(img.className).toContain('opacity-100')
  })

  it('shows fallback icon when error occurs', () => {
    render(<Image src="/bad.png" alt="bad" />)
    const img = screen.getByRole('img', { name: /bad/i }) as HTMLImageElement
    fireEvent.error(img)
    const svg = document.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('shows custom fallback text when showFallbackIcon=false', () => {
    render(<Image src="" alt="empty" showFallbackIcon={false} fallback="No image" />)
    expect(screen.getByText('No image')).toBeTruthy()
  })

  it('calls onError handler', () => {
    const onError = vi.fn()
    render(<Image src="/bad.png" alt="bad" onError={onError} />)
    const img = screen.getByRole('img', { name: /bad/i }) as HTMLImageElement
    fireEvent.error(img)
    expect(onError).toHaveBeenCalled()
  })
})
