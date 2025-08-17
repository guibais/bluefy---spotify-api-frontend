import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSelector } from './LanguageSelector'

describe('LanguageSelector', () => {
  it('renders select with aria-label and default value', () => {
    // Provide href for paraglide runtime
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
})
