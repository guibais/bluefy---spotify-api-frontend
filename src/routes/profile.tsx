import { createFileRoute, Link } from '@tanstack/react-router'
import { useMe, useMyPlaylists } from '@/hooks/useSpotify'
import type { SpotifyPlaylist } from '@/types'
import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
import { Image } from '@/components/atoms/Image/Image'
import { Button, OpenInSpotifyButton } from '@/components/atoms'
import * as m from '@/paraglide/messages.js'
import { useAuth } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { clearTokens } = useAuth()
  const getLocaleFromPath = () => (window.location.pathname.startsWith('/en') ? 'en' : 'pt-BR')
  const setLocale = (locale: 'pt-BR' | 'en') => {
    const { pathname, search, hash } = window.location
    const isEn = pathname.startsWith('/en')
    if (locale === 'en' && !isEn) {
      const next = `/en${pathname}${search}${hash}`
      window.location.assign(next)
      return
    }
    if (locale === 'pt-BR' && isEn) {
      const next = `${pathname.replace(/^\/en/, '')}${search}${hash}`
      window.location.assign(next)
      return
    }
  }
  const handleLogout = () => {
    clearTokens()
    window.location.reload()
  }

  const { data: me, isLoading: meLoading, error: meError } = useMe()
  const {
    data: playlistsData,
    isLoading: playlistsLoading,
  } = useMyPlaylists(10)
  const playlistsFirstPage: SpotifyPlaylist[] = playlistsData?.pages?.[0]?.items ?? []

  if (meError) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-purplefy-white mb-2">{m.error_profile_load_title()}</h3>
          <p className="text-purplefy-light-gray">{meError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block container py-8">
        {meLoading ? (
          <div className="flex items-center gap-6 mb-10">
            <div className="skeleton w-24 h-24 rounded-full" />
            <div className="space-y-3">
              <div className="skeleton h-8 w-48" />
              <div className="skeleton h-4 w-64" />
            </div>
          </div>
        ) : (
          me && (
            <div className="flex items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24">
                  <Image src={me.images?.[0]?.url} alt={me.display_name || me.id} className="w-24 h-24 rounded-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl font-bold text-purplefy-white">{me.display_name || me.id}</h1>
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
                  <p className="text-purplefy-light-gray">{me.email || me.country}</p>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-purplefy-light-gray">
                    <div>
                      <span className="block text-xs uppercase tracking-wide">{m.followers_label()}</span>
                      <span className="text-purplefy-white">{me.followers?.total?.toLocaleString('pt-BR') ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wide">{m.country_label()}</span>
                      <span className="text-purplefy-white">{me.country ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wide">{m.plan_label()}</span>
                      <span className="text-purplefy-white">{me.product ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-spotify-light-gray hover:text-spotify-white">
                  <LogOut className="w-4 h-4" />
                  {m.nav_logout()}
                </Button>
                {me.external_urls?.spotify && <OpenInSpotifyButton url={me.external_urls!.spotify} />}
              </div>
            </div>
          )
        )}

        

        <section>
          <h2 className="text-xl font-semibold text-purplefy-white mb-4">{m.my_playlists()}</h2>
          {playlistsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-pl-${i}`} className="card p-3">
                  <div className="skeleton w-full aspect-square rounded-lg mb-3" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {playlistsFirstPage.map((pl) => (
                <Link key={pl.id} to="/playlist/$playlistId" params={{ playlistId: pl.id }} className="card p-3 hover:bg-purplefy-medium-gray/40 transition-colors">
                  <Image src={pl.images?.[0]?.url} alt={pl.name} className="w-full aspect-square rounded-lg mb-3" />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-spotify-white truncate">{pl.name}</h3>
                      <p className="text-xs text-spotify-light-gray truncate">{pl.tracks?.total ?? 0} {m.tracks_suffix()}</p>
                    </div>
                    {pl.external_urls?.spotify && (
                      <OpenInSpotifyButton
                        url={pl.external_urls!.spotify}
                        iconOnly
                        ariaLabel={`${m.open_in_spotify()} - ${pl.name}`}
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <MobileLayout title={m.profile_title()} showTabs={false}>
        <div className="px-4 py-4">
          {meLoading ? (
            <div className="flex items-center gap-4 mb-6">
              <div className="skeleton w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton h-4 w-40" />
              </div>
            </div>
          ) : (
            me && (
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16">
                  <Image src={me.images?.[0]?.url} alt={me.display_name || me.id} className="w-16 h-16 rounded-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl font-bold text-purplefy-white truncate">{me.display_name || me.id}</h1>
                    <div className="flex items-center gap-2">
                      <select
                        aria-label={m.language_label()}
                        className="text-[11px] bg-purplefy-dark text-purplefy-white border border-purple-500 rounded-full px-2 py-1"
                        defaultValue={getLocaleFromPath()}
                        onChange={(e) => setLocale(e.target.value as 'pt-BR' | 'en')}
                      >
                        <option value="pt-BR">{m.language_portuguese()}</option>
                        <option value="en">{m.language_english()}</option>
                      </select>
                      <Button size="sm" variant="ghost" onClick={handleLogout} className="flex items-center gap-1 text-spotify-light-gray hover:text-spotify-white">
                        <LogOut className="w-3 h-3" />
                        {m.nav_logout()}
                      </Button>
                    </div>
                  </div>
                  <p className="text-purplefy-light-gray text-sm truncate">{me.email || me.country}</p>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-[11px] text-purplefy-light-gray">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">{m.followers_label()}</span>
                      <span className="text-spotify-white">{me.followers?.total?.toLocaleString('pt-BR') ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">{m.country_label()}</span>
                      <span className="text-spotify-white">{me.country ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">{m.plan_label()}</span>
                      <span className="text-spotify-white">{me.product ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          

          <div>
            <h2 className="text-lg font-semibold text-spotify-white mb-3">{m.playlists_title()}</h2>
            {playlistsLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={`m-skel-pl-${i}`} className="card p-2">
                    <div className="skeleton w-full aspect-square rounded-lg mb-2" />
                    <div className="skeleton h-3 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {playlistsFirstPage.slice(0, 6).map((pl) => (
                  <Link key={pl.id} to="/playlist/$playlistId" params={{ playlistId: pl.id }} className="card p-2 hover:bg-purplefy-medium-gray/40 transition-colors">
                    <Image src={pl.images?.[0]?.url} alt={pl.name} className="w-full aspect-square rounded-lg mb-2" />
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-xs font-medium text-spotify-white truncate">{pl.name}</h3>
                        <p className="text-[10px] text-spotify-light-gray truncate">{pl.tracks?.total ?? 0} {m.tracks_suffix()}</p>
                      </div>
                      {pl.external_urls?.spotify && (
                        <OpenInSpotifyButton
                          url={pl.external_urls!.spotify}
                          iconOnly
                          ariaLabel={`${m.open_in_spotify()} - ${pl.name}`}
                        />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
    </>
  )
}
