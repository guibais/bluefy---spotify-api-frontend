import { createFileRoute } from '@tanstack/react-router'
import { m } from '@/paraglide/messages.js'
import { PageTemplate } from '@/components'
import { PlaylistCard, Section } from '@/components/molecules'
import { useNewReleases, useMyPlaylists } from '@/hooks/useSpotify'

export const Route = createFileRoute('/home')({
  component: HomePage,
})

 

function HomePage() {
  const myPlaylists = useMyPlaylists(20)
  const newReleases = useNewReleases(12, 'BR')

  const myItems = myPlaylists.data?.pages.flatMap((p) => p.items) ?? []
  const releases = newReleases.data?.albums.items ?? []

  const desktop = (
    <>
  

      <Section title={m.home_playlists_title()}>
        {myPlaylists.isLoading ? (
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-purplefy-dark/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {myItems.map((p) => (
              <PlaylistCard
                key={p.id}
                id={p.id}
                name={p.name}
                image={p.images?.[0]?.url}
                subtitle={p.owner?.display_name || ''}
                spotifyUrl={p.external_urls?.spotify}
                to={`/playlist/${p.id}`}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title={m.home_new_releases_title()}>
        {newReleases.isLoading ? (
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-purplefy-dark/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {releases.map((a) => (
              <PlaylistCard
                key={a.id}
                id={a.id}
                name={a.name}
                image={a.images?.[0]?.url}
                subtitle={a.artists?.[0]?.name || ''}
                spotifyUrl={a.external_urls?.spotify}
                to={`/album/${a.id}`}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  )

  const mobile = (
    <>
      <h1 className="text-2xl font-bold text-purplefy-white mb-4">{m.home_mobile_experience_title()}</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-purplefy-white mb-3">{m.home_playlists_title()}</h2>
        {myPlaylists.isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-purplefy-dark/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {myItems.map((p) => (
              <PlaylistCard
                key={p.id}
                id={p.id}
                name={p.name}
                image={p.images?.[0]?.url}
                subtitle={p.owner?.display_name || ''}
                spotifyUrl={p.external_urls?.spotify}
                to={`/playlist/${p.id}`}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-purplefy-white mb-3">{m.home_new_releases_title()}</h2>
        {newReleases.isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-purplefy-dark/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {releases.slice(0, 8).map((a) => (
              <PlaylistCard
                key={a.id}
                id={a.id}
                name={a.name}
                image={a.images?.[0]?.url}
                subtitle={a.artists?.[0]?.name || ''}
                spotifyUrl={a.external_urls?.spotify}
                to={`/album/${a.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )

  return (
    <PageTemplate
      title={m.page_home_title()}
      description={m.page_home_description()}
      showBack={false}
      showTabs
      desktop={desktop}
      mobile={mobile}
    />
  )
}
