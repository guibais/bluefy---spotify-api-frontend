import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BackButton } from '@/components'
import { useEffect, useRef, useState } from 'react'
import { Loading } from '@/components/atoms'
import { spotifyAuth } from '@/services/spotifyAuth'
import { z } from 'zod'
import * as m from '@/paraglide/messages.js'

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
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true
    const handleCallback = async () => {
      try {
        const { code, error } = search

        if (error) {
          setStatus('error')
          setErrorMessage(`${m.auth_error_title()}: ${error}`)
          return
        }

        if (!code) {
          setStatus('error')
          setErrorMessage(m.auth_error_title())
          return
        }

        await spotifyAuth.getToken(code)
        setStatus('success')
        const to = search.state && search.state.length > 0 ? search.state : '/home'
        setTimeout(() => {
          navigate({ to })
        }, 2000)
      } catch (error) {
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : m.error_title())
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
              {m.auth_processing_title()}
            </h1>
            <p className="text-spotify-light-gray">
              {m.auth_processing_message()}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-2xl font-bold mb-4 text-spotify-white">
              {m.auth_success_title()}
            </h1>
            <p className="text-spotify-light-gray">
              {m.auth_success_message()}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-2xl font-bold mb-4 text-spotify-white">
              {m.auth_error_title()}
            </h1>
            <p className="mb-6 text-spotify-light-gray">
              {errorMessage}
            </p>
            <BackButton fallbackTo="/home" variant="primary">
              {m.back_to_home()}
            </BackButton>
          </>
        )}
      </div>
    </div>
  )
}
