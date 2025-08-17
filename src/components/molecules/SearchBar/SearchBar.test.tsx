import { render, screen, fireEvent, act } from '@testing-library/react'
import { SearchBar } from './SearchBar'

vi.useFakeTimers()

describe('SearchBar', () => {
  it('debounces onSearch and supports clear', async () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    const input = screen.getByRole('textbox')
    expect(onSearch).toHaveBeenCalledWith("")
    fireEvent.change(input, { target: { value: 'ab' } })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(onSearch).toHaveBeenCalledWith('ab')

    const clearBtn = screen.getByRole('button')
    fireEvent.click(clearBtn)
  })
})
