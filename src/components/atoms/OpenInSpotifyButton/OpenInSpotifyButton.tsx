import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/atoms/Button/Button'
import * as m from '@/paraglide/messages.js'

type Props = {
  url: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
  iconOnly?: boolean
  ariaLabel?: string
  className?: string
}

export function OpenInSpotifyButton({ url, variant = 'secondary', size = 'md', iconOnly = false, ariaLabel, className }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open(url, '_blank')
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={className ?? 'text-blue-500 hover:text-blue-400 inline-flex items-center gap-2'}
        aria-label={ariaLabel ?? m.open_in_spotify()}
        title={ariaLabel ?? m.open_in_spotify()}
      >
        <ExternalLink className="w-4 h-4" />
      </button>
    )
  }

  return (
    <Button onClick={handleClick} variant={variant} size={size} className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <ExternalLink className="w-4 h-4" />
      {m.open_in_spotify()}
    </Button>
  )
}
