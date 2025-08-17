import { Button } from '@/components/atoms'
import { spotifyAuth } from '@/services/spotifyAuth'
import { Music, LogIn } from 'lucide-react'
import * as m from '@/paraglide/messages.js'

type SpotifyLoginProps = {
  onLogin?: () => void
  state?: string
}

export const SpotifyLogin = ({ onLogin, state }: SpotifyLoginProps) => {
  const handleLogin = async () => {
    try {
      await spotifyAuth.redirectToSpotifyAuth(state)
      onLogin?.()
    } catch (error) {
      console.error('Erro ao iniciar login:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="card p-8">
        <Music className="w-16 h-16 mx-auto mb-6 text-blue-500" />
        
        <h2 className="text-2xl font-bold mb-4 text-spotify-white">
          {m.login_title()}
        </h2>
        
        <p className="mb-6 text-spotify-light-gray">
          {m.login_description()}
        </p>

        <Button
          onClick={handleLogin}
          size="lg"
          fullWidth
          className="inline-flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          {m.login_button()}
        </Button>

        <p className="text-sm mt-4 text-spotify-light-gray">
          {m.login_redirect_note()}
        </p>
      </div>
    </div>
  )
}
