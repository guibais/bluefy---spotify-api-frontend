import { createFileRoute, Link } from '@tanstack/react-router'
import { m } from '@/paraglide/messages.js'
import { PageTemplate } from '@/components'
import { useNewReleases, useMyPlaylists } from '@/hooks/useSpotify'
import { Image } from '@/components/atoms/Image/Image'
import { Button } from '@/components/atoms/Button/Button'

export const Route = createFileRoute('/home')({
  component: HomePage,
})

type CardProps = {
  id: string
  name: string
  image?: string
  subtitle?: string
  spotifyUrl?: string
  to?: string
}

function PlaylistCard({ name, image, subtitle, spotifyUrl, to }: CardProps) {
  const handleOpen = () => {
    if (spotifyUrl) window.open(spotifyUrl, '_blank')
  }
  return (
    <div className="group bg-purplefy-dark/40 border border-purplefy-medium-gray rounded-xl p-3 hover:border-purplefy-primary/50 transition-colors">
      {to ? (
        <Link to={to} className="block w-full text-left">
          <div className="aspect-square w-full overflow-hidden rounded-lg mb-3 bg-purplefy-black">
            {image ? (
              <Image src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purplefy-light-gray">🎶</div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purplefy-white line-clamp-1">{name}</h3>
            {subtitle && (
              <p className="text-xs text-purplefy-light-gray line-clamp-1">{subtitle}</p>
            )}
          </div>
        </Link>
      ) : (
        <button onClick={handleOpen} className="w-full text-left">
          <div className="aspect-square w-full overflow-hidden rounded-lg mb-3 bg-purplefy-black">
            {image ? (
              <Image src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purplefy-light-gray">🎶</div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purplefy-white line-clamp-1">{name}</h3>
            {subtitle && (
              <p className="text-xs text-purplefy-light-gray line-clamp-1">{subtitle}</p>
            )}
          </div>
        </button>
      )}
      {spotifyUrl && (
        <div className="mt-3">
          <Button onClick={handleOpen} variant="secondary" className="w-full">{m.open_in_spotify()}</Button>
        </div>
      )}
    </div>
  )
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purplefy-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

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
