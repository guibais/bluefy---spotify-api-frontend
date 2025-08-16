import { Home, Search, User } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'

type Tab = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  to: string
}

const tabs: Tab[] = [
  {
    id: 'home',
    label: 'Início',
    icon: Home,
    to: '/home'
  },
  {
    id: 'search',
    label: 'Buscar',
    icon: Search,
    to: '/'
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: User,
    to: '/profile'
  }
]

export const BottomTabs = () => {
  const location = useLocation()
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-purplefy-black/95 backdrop-blur-lg border-t border-purplefy-medium-gray">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to
          const Icon = tab.icon
          
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-purplefy-primary bg-purplefy-primary/10' 
                  : 'text-purplefy-light-gray hover:text-purplefy-white'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

