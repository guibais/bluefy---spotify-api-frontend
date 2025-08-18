import { render, screen, fireEvent } from '@testing-library/react'
import { SpotifyLogin } from './SpotifyLogin'

vi.mock('@/services/spotifyAuth', () => ({
  spotifyAuth: {
    redirectToSpotifyAuth: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('SpotifyLogin', () => {
  it('renders login content and triggers redirect on click', async () => {
    const onLogin = vi.fn()
    const { spotifyAuth } = await import('@/services/spotifyAuth')
    render(<SpotifyLogin onLogin={onLogin} state="xyz" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(spotifyAuth.redirectToSpotifyAuth).toHaveBeenCalledWith('xyz')
  })

  it('handles redirect error and logs it without calling onLogin', async () => {
    const onLogin = vi.fn()
    const { spotifyAuth } = await import('@/services/spotifyAuth')
    ;(spotifyAuth.redirectToSpotifyAuth as any).mockRejectedValueOnce(
      new Error('fail')
    )

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<SpotifyLogin onLogin={onLogin} state="bad" />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    await vi.waitFor(() => {
      expect(errorSpy).toHaveBeenCalled()
    })
    expect(onLogin).not.toHaveBeenCalled()

    errorSpy.mockRestore()
  })
})
