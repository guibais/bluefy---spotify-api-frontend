import * as m from '@/paraglide/messages.js'

type Props = {
  size?: 'sm' | 'md'
  className?: string
}

export function LanguageSelector({ size = 'md', className }: Props) {
  const getLocaleFromPath = () => (typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'pt-BR')
  const setLocale = (locale: 'pt-BR' | 'en') => {
    if (typeof window === 'undefined') return
    const { pathname, search, hash } = window.location
    const isEn = pathname.startsWith('/en')
    if (locale === 'en' && !isEn) {
      window.location.assign(`/en${pathname}${search}${hash}`)
      return
    }
    if (locale === 'pt-BR' && isEn) {
      window.location.assign(`${pathname.replace(/^\/en/, '')}${search}${hash}`)
      return
    }
  }

  const cls = size === 'sm'
    ? 'text-[11px] bg-purplefy-dark text-purplefy-white border border-purple-500 rounded-full px-2 py-1'
    : 'text-xs bg-purplefy-dark text-purplefy-white border border-purple-500 rounded-full px-3 py-1'

  return (
    <select
      aria-label={m.language_label()}
      className={[cls, className].filter(Boolean).join(' ')}
      defaultValue={getLocaleFromPath()}
      onChange={(e) => setLocale(e.target.value as 'pt-BR' | 'en')}
    >
      <option value="pt-BR">{m.language_portuguese()}</option>
      <option value="en">{m.language_english()}</option>
    </select>
  )
}
