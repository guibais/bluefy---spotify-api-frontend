import { Link } from '@tanstack/react-router'

type NavItemProps = {
  to: string
  label: string
}

export function NavItem({ to, label }: NavItemProps) {
  return (
    <Link 
      to={to}
      className="text-spotify-light-gray hover:text-spotify-white transition-colors"
      activeProps={{ className: 'text-blue-500' }}
    >
      {label}
    </Link>
  )
}
