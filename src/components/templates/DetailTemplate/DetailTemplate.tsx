import { MobileLayout } from '@/components/organisms/MobileLayout/MobileLayout'
import type { PropsWithChildren, ReactNode } from 'react'

export type DetailTemplateProps = PropsWithChildren<{
  title: string
  backTo?: '/home' | '/profile' | '/search' | '/login'
  showTabs?: boolean
  header?: ReactNode
  actions?: ReactNode
}> 

export const DetailTemplate = ({ title, backTo = '/home', showTabs = false, header, actions, children }: DetailTemplateProps) => {
  return (
    <>
      <div className="hidden md:block container py-8">
        {actions && (
          <div className="mb-6">{actions}</div>
        )}
        {header}
        {children}
      </div>

      <MobileLayout title={title} backTo={backTo} showTabs={showTabs}>
        <div className="px-4 py-4">
          {header}
          {children}
        </div>
      </MobileLayout>
    </>
  )
}
