import { Button } from '@/components/atoms'
import { type ButtonHTMLAttributes } from 'react'
import { useRouter } from '@tanstack/react-router'
import * as m from '@/paraglide/messages.js'

type BackButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fallbackTo?: '/home' | '/profile' | '/search' | '/login'
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export const BackButton = ({ fallbackTo = '/home', children, variant = 'primary', size = 'md', loading = false, fullWidth = false, ...props }: BackButtonProps) => {
  const router = useRouter()

  const handleClick = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    router.navigate({ to: fallbackTo })
  }

  return (
    <Button onClick={handleClick} variant={variant} size={size} loading={loading} fullWidth={fullWidth} {...props}>
      {children || m.back_label()}
    </Button>
  )
}
