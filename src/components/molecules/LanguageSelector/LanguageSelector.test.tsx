import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSelector } from './LanguageSelector'

describe('LanguageSelector', () => {
  it('renders select with aria-label and default value', () => {
    Object.defineProperty(window, 'location', { value: { href: 'http://localhost/', pathname: '/', search: '', hash: '', assign: vi.fn() } as any, writable: true })
    render(<LanguageSelector />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.getAttribute('aria-label')).toBeTruthy()
    expect(['pt-BR', 'en']).toContain(select.value)
  })

  it('assigns when switching to en and back', () => {
    const assign = vi.fn()
    Object.defineProperty(window, 'location', { value: { href: 'http://localhost/?q=1#h', pathname: '/', search: '?q=1', hash: '#h', assign } as any, writable: true })
    render(<LanguageSelector />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'en' } })
    expect(assign).toHaveBeenCalled()
  })

  it('assigns stripping /en when switching to pt-BR', () => {
    const assign = vi.fn()
    Object.defineProperty(window, 'location', { value: { href: 'http://localhost/en/home?q=1#h', pathname: '/en/home', search: '?q=1', hash: '#h', assign } as any, writable: true })
    render(<LanguageSelector />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('en')
    fireEvent.change(select, { target: { value: 'pt-BR' } })
    expect(assign).toHaveBeenCalledWith('/home?q=1#h')
  })

  it('does not assign when selecting the same locale', () => {
    const assign = vi.fn()
    Object.defineProperty(window, 'location', { value: { href: 'http://localhost/en', pathname: '/en', search: '', hash: '', assign } as any, writable: true })
    render(<LanguageSelector />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('en')
    fireEvent.change(select, { target: { value: 'en' } })
    expect(assign).not.toHaveBeenCalled()
  })

  it('applies small size class when size="sm"', () => {
    Object.defineProperty(window, 'location', { value: { href: 'http://localhost/', pathname: '/', search: '', hash: '', assign: vi.fn() } as any, writable: true })
    render(<LanguageSelector size="sm" />)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.className).toContain('text-[11px]')
  })
})
