import { createFileRoute } from '@tanstack/react-router'
import { useMe, useMyPlaylists } from '@/hooks/useSpotify'
import type { SpotifyPlaylist } from '@/types'
import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
import { Button, OpenInSpotifyButton } from '@/components/atoms'
import { LanguageSelector, MiniPlaylistCard } from '@/components/molecules'
import { ProfileHeader } from '@/components/organisms'
import * as m from '@/paraglide/messages.js'
import { useAuth } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { clearTokens } = useAuth()
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
            <ProfileHeader
              name={me.display_name || me.id}
              imageUrl={me.images?.[0]?.url}
              subtitle={me.email || me.country}
              stats={[
                { label: m.followers_label(), value: me.followers?.total?.toLocaleString('pt-BR') ?? '-' },
                { label: m.country_label(), value: me.country ?? '-' },
                { label: m.plan_label(), value: me.product ?? '-' },
              ]}
              titleExtraLeft={<LanguageSelector />}
              rightSlot={
                <div className="flex items-center gap-3">
                  <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-spotify-light-gray hover:text-spotify-white">
                    <LogOut className="w-4 h-4" />
                    {m.nav_logout()}
                  </Button>
                  {me.external_urls?.spotify && <OpenInSpotifyButton url={me.external_urls!.spotify} />}
                </div>
              }
              layout="desktop"
            />
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
                <MiniPlaylistCard
                  key={pl.id}
                  id={pl.id}
                  name={pl.name}
                  imageUrl={pl.images?.[0]?.url}
                  tracksCount={pl.tracks?.total ?? 0}
                  externalUrl={pl.external_urls?.spotify}
                  size="desktop"
                />
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
              <ProfileHeader
                name={me.display_name || me.id}
                imageUrl={me.images?.[0]?.url}
                subtitle={me.email || me.country}
                stats={[
                  { label: m.followers_label(), value: me.followers?.total?.toLocaleString('pt-BR') ?? '-' },
                  { label: m.country_label(), value: me.country ?? '-' },
                  { label: m.plan_label(), value: me.product ?? '-' },
                ]}
                rightSlot={
                  <div className="flex items-center gap-2">
                    <LanguageSelector size="sm" />
                    <Button size="sm" variant="ghost" onClick={handleLogout} className="flex items-center gap-1 text-spotify-light-gray hover:text-spotify-white">
                      <LogOut className="w-3 h-3" />
                      {m.nav_logout()}
                    </Button>
                  </div>
                }
                layout="mobile"
              />
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
                  <MiniPlaylistCard
                    key={pl.id}
                    id={pl.id}
                    name={pl.name}
                    imageUrl={pl.images?.[0]?.url}
                    tracksCount={pl.tracks?.total ?? 0}
                    externalUrl={pl.external_urls?.spotify}
                    size="mobile"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
    </>
  )
}
