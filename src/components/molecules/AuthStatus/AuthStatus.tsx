import { Loading } from '@/components/atoms'
import * as m from '@/paraglide/messages.js'
import type { ReactNode } from 'react'

type Props = {
  status: 'processing' | 'success' | 'error'
  errorMessage?: string
  action?: ReactNode
}

export function AuthStatus({ status, errorMessage, action }: Props) {
  return (
    <div className="text-center max-w-md mx-auto">
      {status === 'processing' && (
        <>
          <Loading size="lg" />
          <h1 className="text-2xl font-bold mt-6 mb-4 text-spotify-white">{m.auth_processing_title()}</h1>
          <p className="text-spotify-light-gray">{m.auth_processing_message()}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold mb-4 text-spotify-white">{m.auth_success_title()}</h1>
          <p className="text-spotify-light-gray">{m.auth_success_message()}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold mb-4 text-spotify-white">{m.auth_error_title()}</h1>
          <p className="mb-6 text-spotify-light-gray">{errorMessage}</p>
          {action}
        </>
      )}
    </div>
  )
}
