import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
import type { PropsWithChildren, ReactNode } from 'react'

export type GridPageTemplateProps = PropsWithChildren<{
  title: string
  description?: string
  toolbar?: ReactNode
  pagination?: ReactNode
  showTabs?: boolean
  mobileShowBack?: boolean
}> 

export const GridPageTemplate = ({ title, description, toolbar, pagination, showTabs = false, mobileShowBack = false, children }: GridPageTemplateProps) => {
  return (
    <>
      <div className="hidden md:block container py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-3">{title}</h1>
          {description && (
            <p className="text-purplefy-light-gray text-lg md:text-xl max-w-2xl mx-auto">{description}</p>
          )}
        </div>
        {toolbar && (
          <div className="max-w-2xl mx-auto mb-8">{toolbar}</div>
        )}
        {children}
        {pagination}
      </div>

      <MobileLayout title={title} showBack={mobileShowBack} showTabs={showTabs}>
        <div className="px-4 py-4">
          {toolbar && (
            <div className="mb-6">{toolbar}</div>
          )}
          {children}
          {pagination}
        </div>
      </MobileLayout>
    </>
  )
}
