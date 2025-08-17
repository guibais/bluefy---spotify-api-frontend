import { render, screen, fireEvent } from '@testing-library/react'
import { OpenInSpotifyButton } from './OpenInSpotifyButton'

const openSpy = vi.spyOn(window, 'open')

describe('OpenInSpotifyButton', () => {
  beforeEach(() => {
    openSpy.mockReset()
    openSpy.mockImplementation(() => null as any)
  })

  it('opens url in new tab (button mode)', () => {
    render(<OpenInSpotifyButton url="https://spotify.test/track/1" />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(openSpy).toHaveBeenCalledWith('https://spotify.test/track/1', '_blank')
  })

  it('opens url in new tab (iconOnly mode) with default aria', () => {
    render(<OpenInSpotifyButton url="https://spotify.test/album/2" iconOnly />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(openSpy).toHaveBeenCalledWith('https://spotify.test/album/2', '_blank')
    expect(btn.getAttribute('aria-label')).toBeTruthy()
  })

  it('uses custom ariaLabel in iconOnly mode and applies className', () => {
    render(
      <OpenInSpotifyButton 
        url="https://spotify.test/playlist/3" 
        iconOnly 
        ariaLabel="abrir" 
        className="custom"
      />
    )
    const btn = screen.getByRole('button')
    expect(btn.getAttribute('aria-label')).toBe('abrir')
    expect(btn.className).toContain('custom')
  })
})
