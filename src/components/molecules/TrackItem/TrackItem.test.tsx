import { render, screen, fireEvent } from '@testing-library/react'
import { TrackItem } from './TrackItem'

vi.spyOn(window, 'open').mockImplementation(() => null as any)

const base = {
  id: 't1',
  name: 'Song',
  duration_ms: 125000,
  explicit: true,
  popularity: 50,
  artists: [{ id: 'a1', name: 'Artist' }],
  album: { id: 'al1', name: 'Alb', images: [{ url: '/i.png' }] },
  external_urls: { spotify: 'https://s' }
}

describe('TrackItem', () => {
  it('shows index, album image, explicit badge and opens external link', () => {
    render(<TrackItem track={base as any} index={0} showAlbum />)
    expect(screen.getByText('E')).toBeTruthy()
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(window.open).toHaveBeenCalled()
  })
})
