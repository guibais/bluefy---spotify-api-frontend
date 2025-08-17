import { createFileRoute } from '@tanstack/react-router'
import { SpotifyLogin } from '@/components/molecules/SpotifyLogin/SpotifyLogin'
import { z } from 'zod'
import * as m from '@/paraglide/messages.js'

const loginSearchSchema = z.object({
  from: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: () => {
    const search = Route.useSearch()
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <div className="w-full max-w-md px-4">
          <div className="flex justify-end mb-4">
            <select
              aria-label={m.language_label()}
              className="text-xs bg-purplefy-dark text-purplefy-white border border-purple-500 rounded-full px-3 py-1"
              defaultValue={getLocaleFromPath()}
              onChange={(e) => setLocale(e.target.value as 'pt-BR' | 'en')}
            >
              <option value="pt-BR">{m.language_portuguese()}</option>
              <option value="en">{m.language_english()}</option>
            </select>
          </div>
          <SpotifyLogin state={search.from} />
        </div>
      </div>
    )
  },
})
