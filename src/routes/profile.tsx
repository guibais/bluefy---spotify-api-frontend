import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { useMe, useMyPlaylists } from '@/hooks/useSpotify'
import type { SpotifyPlaylist } from '@/types'
import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
import { Image } from '@/components/atoms/Image/Image'
import { Button } from '@/components/atoms/Button/Button'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
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
          <h3 className="text-xl font-semibold text-purplefy-white mb-2">Erro ao carregar perfil</h3>
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
                  <h1 className="text-3xl font-bold text-purplefy-white">{me.display_name || me.id}</h1>
                  <p className="text-purplefy-light-gray">{me.email || me.country}</p>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-purplefy-light-gray">
                    <div>
                      <span className="block text-xs uppercase tracking-wide">Seguidores</span>
                      <span className="text-purplefy-white">{me.followers?.total?.toLocaleString('pt-BR') ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wide">País</span>
                      <span className="text-purplefy-white">{me.country ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wide">Plano</span>
                      <span className="text-purplefy-white">{me.product ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
              {me.external_urls?.spotify && (
                <Button onClick={() => window.open(me.external_urls!.spotify, '_blank')} variant="secondary" className="inline-flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Abrir no Spotify
                </Button>
              )}
            </div>
          )
        )}

        

        <section>
          <h2 className="text-xl font-semibold text-purplefy-white mb-4">Minhas playlists</h2>
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
                <div key={pl.id} className="card p-3">
                  <Image src={pl.images?.[0]?.url} alt={pl.name} className="w-full aspect-square rounded-lg mb-3" />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-spotify-white truncate">{pl.name}</h3>
                      <p className="text-xs text-spotify-light-gray truncate">{pl.tracks?.total ?? 0} músicas</p>
                    </div>
                    {pl.external_urls?.spotify && (
                      <button
                        type="button"
                        onClick={() => window.open(pl.external_urls.spotify, '_blank')}
                        className="text-blue-500 hover:text-blue-400"
                        aria-label={`Abrir playlist ${pl.name} no Spotify`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <MobileLayout title="Perfil" showTabs={false}>
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
                <div>
                  <h1 className="text-xl font-bold text-purplefy-white">{me.display_name || me.id}</h1>
                  <p className="text-purplefy-light-gray text-sm">{me.email || me.country}</p>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-[11px] text-purplefy-light-gray">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">Seg.</span>
                      <span className="text-spotify-white">{me.followers?.total?.toLocaleString('pt-BR') ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">País</span>
                      <span className="text-spotify-white">{me.country ?? '-'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wide">Plano</span>
                      <span className="text-spotify-white">{me.product ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          

          <div>
            <h2 className="text-lg font-semibold text-spotify-white mb-3">Playlists</h2>
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
                  <div key={pl.id} className="card p-2">
                    <Image src={pl.images?.[0]?.url} alt={pl.name} className="w-full aspect-square rounded-lg mb-2" />
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-xs font-medium text-spotify-white truncate">{pl.name}</h3>
                        <p className="text-[10px] text-spotify-light-gray truncate">{pl.tracks?.total ?? 0} músicas</p>
                      </div>
                      {pl.external_urls?.spotify && (
                        <button
                          type="button"
                          onClick={() => window.open(pl.external_urls.spotify, '_blank')}
                          className="text-blue-500 hover:text-blue-400"
                          aria-label={`Abrir playlist ${pl.name} no Spotify`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
    </>
  )
}
