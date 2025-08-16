import { type ReactNode } from 'react'
import { MobileHeader } from '../../molecules/MobileHeader/MobileHeader'
import { BottomTabs } from '../../molecules/BottomTabs/BottomTabs'

type MobileLayoutProps = {
  children: ReactNode
  title: string
  backTo?: string
  showBack?: boolean
  showTabs?: boolean
}

export const MobileLayout = ({ 
  children, 
  title, 
  backTo = '/', 
  showBack = true,
  showTabs = true 
}: MobileLayoutProps) => {
  return (
    <div className="md:hidden min-h-screen bg-purplefy-black">
      <MobileHeader title={title} backTo={backTo} showBack={showBack} />
      
      <main className={`pt-16 ${showTabs ? 'pb-20' : 'pb-4'}`}>
        {children}
      </main>
      
      {showTabs && <BottomTabs />}
    </div>
  )
}
