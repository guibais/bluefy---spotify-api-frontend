import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Loading } from '@/components/atoms'
import { spotifyAuth } from '@/services/spotifyAuth'
import { z } from 'zod'

const callbackSearchSchema = z.object({
  code: z.string().optional(),
  error: z.string().optional(),
  state: z.string().optional(),
})

export const Route = createFileRoute('/callback')({
  validateSearch: callbackSearchSchema,
  component: CallbackPage,
})

function CallbackPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code, error } = search

        if (error) {
          setStatus('error')
          setErrorMessage(`Erro na autorização: ${error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setErrorMessage('Código de autorização não encontrado')
          return
        }

        await spotifyAuth.getToken(code)
        setStatus('success')
        const to = search.state && search.state.length > 0 ? search.state : '/'
        setTimeout(() => {
          navigate({ to })
        }, 2000)
      } catch (error) {
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido')
      }
    }

    handleCallback()
  }, [navigate, search])

  return (
    <div className="container py-16">
      <div className="text-center max-w-md mx-auto">
        {status === 'processing' && (
          <>
            <Loading size="lg" />
            <h1 className="text-2xl font-bold mt-6 mb-4 text-spotify-white">
              Processando autenticação...
            </h1>
            <p className="text-spotify-light-gray">
              Aguarde enquanto configuramos sua conexão com o Spotify
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-2xl font-bold mb-4 text-spotify-white">
              Conectado com sucesso!
            </h1>
            <p className="text-spotify-light-gray">
              Redirecionando para a página inicial...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-2xl font-bold mb-4 text-spotify-white">
              Erro na autenticação
            </h1>
            <p className="mb-6 text-spotify-light-gray">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="px-6 py-2 rounded-full font-semibold transition-colors bg-blue-500 hover:bg-blue-400 text-black"
            >
              Voltar ao início
            </button>
          </>
        )}
      </div>
    </div>
  )
}
