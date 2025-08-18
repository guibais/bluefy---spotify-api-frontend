import { Link } from '@tanstack/react-router'
import { Music, LogOut } from 'lucide-react'
import { NavItem } from '@/components/molecules/NavItem/NavItem'
import * as m from '@/paraglide/messages.js'

type Props = {
  isAuthenticated: boolean
  onLogout: () => void
}

export function DesktopHeader({ isAuthenticated, onLogout }: Props) {
  return (
  <>
    <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-purplefy-black/95 backdrop-blur-lg border-b border-purplefy-medium-gray">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center gap-2 text-purplefy-accent hover:text-purplefy-secondary transition-colors">
            <Music className="w-8 h-8" />
            <span className="text-xl font-bold">purplefy</span>
          </Link>

          <nav className="flex items-center gap-6" aria-label={m.primary_navigation_label()}>
            <NavItem to="/home" label={m.nav_home()} />
            <NavItem to="/search" label={m.nav_search()} />
            {isAuthenticated && <NavItem to="/profile" label={m.nav_profile()} />}
            {isAuthenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 text-purplefy-light-gray hover:text-purplefy-white transition-colors"
                aria-label={m.nav_logout()}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{m.nav_logout()}</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
    <div className="h-16"></div>
  </>
  )
}
