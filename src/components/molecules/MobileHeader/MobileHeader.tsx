import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

type MobileHeaderProps = {
  title: string
  backTo?: string
  showBack?: boolean
}

export const MobileHeader = ({ title, backTo = '/', showBack = true }: MobileHeaderProps) => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-purplefy-black/95 backdrop-blur-lg border-b border-purplefy-medium-gray">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link 
              to={backTo}
              className="p-2 -ml-2 text-purplefy-light-gray hover:text-purplefy-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <h1 className="text-lg font-semibold text-purplefy-white truncate">
            {title}
          </h1>
        </div>
      </div>
    </header>
  )
}
