import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
import type { ReactNode } from 'react'

export type PageTemplateProps = {
  title: string
  description?: string
  showBack?: boolean
  showTabs?: boolean
  toolbarDesktop?: ReactNode
  toolbarMobile?: ReactNode
  desktop?: ReactNode
  mobile?: ReactNode
}

export const PageTemplate = ({
  title,
  description,
  showBack = false,
  showTabs = false,
  toolbarDesktop,
  toolbarMobile,
  desktop,
  mobile,
}: PageTemplateProps) => {
  return (
    <>
      <div className="hidden md:block container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-3">{title}</h1>
          {description && (
            <p className="text-purplefy-light-gray text-lg md:text-xl max-w-2xl mx-auto">{description}</p>
          )}
        </div>
        {toolbarDesktop}
        {desktop}
      </div>

      <MobileLayout title={title} showBack={showBack} showTabs={showTabs}>
        <div className="px-4 py-4">
          {toolbarMobile}
          {mobile}
        </div>
      </MobileLayout>
    </>
  )
}
 
