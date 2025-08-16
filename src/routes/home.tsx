import { createFileRoute } from '@tanstack/react-router'
import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
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
}

function PlaylistCard({ name, image, subtitle, spotifyUrl }: CardProps) {
  const handleOpen = () => {
    if (spotifyUrl) window.open(spotifyUrl, '_blank')
  }
  return (
    <div className="group bg-purplefy-dark/40 border border-purplefy-medium-gray rounded-xl p-3 hover:border-purplefy-primary/50 transition-colors">
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
      {spotifyUrl && (
        <div className="mt-3">
          <Button onClick={handleOpen} variant="secondary" className="w-full">Abrir no Spotify</Button>
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

  const loadMore = () => {
    if (myPlaylists.hasNextPage && !myPlaylists.isFetchingNextPage) myPlaylists.fetchNextPage()
  }

  return (
    <>
      <div className="hidden md:block container py-8">
        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-3">Bem-vindo(a)</h1>
          <p className="text-purplefy-light-gray text-lg">Descubra suas playlists e explore destaques do Spotify.</p>
        </div>

        <Section title="Suas Playlists" action={
          myPlaylists.hasNextPage ? (
            <Button onClick={loadMore} disabled={myPlaylists.isFetchingNextPage}>Carregar mais</Button>
          ) : null
        }>
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
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Novos Lançamentos">
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
      </div>

      <MobileLayout title="Início" showBack={false} showTabs>
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-purplefy-white mb-4">Sua experiência</h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-purplefy-white mb-3">Suas Playlists</h2>
            {myPlaylists.isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-xl bg-purplefy-dark/40 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {myItems.slice(0, 8).map((p) => (
                  <PlaylistCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    image={p.images?.[0]?.url}
                    subtitle={p.owner?.display_name || ''}
                    spotifyUrl={p.external_urls?.spotify}
                  />
                ))}
              </div>
            )}
            {myPlaylists.hasNextPage && (
              <div className="mt-3">
                <Button onClick={loadMore} disabled={myPlaylists.isFetchingNextPage} className="w-full">Carregar mais</Button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-purplefy-white mb-3">Novos Lançamentos</h2>
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
        </div>
      </MobileLayout>
    </>
  )
}
