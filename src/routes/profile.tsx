import { createFileRoute, Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { useMe } from '@/hooks/useSpotify'
import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
import { Image } from '@/components/atoms/Image/Image'
import { Button } from '@/components/atoms/Button/Button'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: me, isLoading: meLoading, error: meError } = useMe()

  if (meError) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-purplefy-white mb-2">Erro ao carregar perfil</h3>
          <p className="text-purplefy-light-gray mb-4">{meError.message}</p>
          <Link to="/">
            <Button variant="primary">Voltar</Button>
          </Link>
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
      </div>

      <MobileLayout title="Perfil" backTo="/" showTabs={false}>
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
                </div>
              </div>
            )
          )}
        </div>
      </MobileLayout>
    </>
  )
}
