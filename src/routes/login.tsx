import { createFileRoute } from '@tanstack/react-router'
import { SpotifyLogin } from '@/components/molecules/SpotifyLogin/SpotifyLogin'
import { z } from 'zod'

const loginSearchSchema = z.object({
  from: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: () => {
    const search = Route.useSearch()
    return (
      <div className="min-h-screen flex items-center justify-center bg-spotify-black">
        <div className="w-full max-w-md px-4">
          <SpotifyLogin state={search.from} />
        </div>
      </div>
    )
  },
})
