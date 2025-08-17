import { render, screen, fireEvent } from '@testing-library/react'
import { PlayButton } from './PlayButton'

vi.mock('@/hooks/useAudioPlayer', () => {
  return {
    useAudioPlayer: () => ({
      currentPlaylistId: mockState.currentPlaylistId,
      isPlaying: mockState.isPlaying,
      playPlaylist: mockFns.playPlaylist,
      togglePlayPause: mockFns.togglePlayPause,
    }),
  }
})

const mockFns = {
  playPlaylist: vi.fn(),
  togglePlayPause: vi.fn(),
}

const mockState = {
  currentPlaylistId: 'same',
  isPlaying: false,
}

describe('PlayButton', () => {
  beforeEach(() => {
    mockFns.playPlaylist.mockReset()
    mockFns.togglePlayPause.mockReset()
    mockState.currentPlaylistId = 'same'
    mockState.isPlaying = false
  })

  it('is disabled when no playlistId', () => {
    render(<PlayButton />)
    const btn = screen.getByRole('button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    fireEvent.click(btn)
    expect(mockFns.playPlaylist).not.toHaveBeenCalled()
    expect(mockFns.togglePlayPause).not.toHaveBeenCalled()
  })

  it('calls togglePlayPause when clicking current playlist', () => {
    render(<PlayButton playlistId="same" />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(mockFns.togglePlayPause).toHaveBeenCalled()
    expect(mockFns.playPlaylist).not.toHaveBeenCalled()
  })

  it('calls playPlaylist when clicking different playlist', () => {
    render(<PlayButton playlistId="other" />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(mockFns.playPlaylist).toHaveBeenCalledWith('other')
  })

  it('aria-label reflects playing state', () => {
    mockState.currentPlaylistId = 'same'
    mockState.isPlaying = true
    render(<PlayButton playlistId="same" />)
    const btn = screen.getByRole('button')
    expect(btn.getAttribute('aria-label')?.toLowerCase()).toContain('pausar')
  })
})
