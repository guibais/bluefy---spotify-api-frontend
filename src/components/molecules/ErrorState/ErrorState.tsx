import type { ReactNode } from 'react'

export type ErrorStateProps = {
  title?: string
  message?: string
  icon?: ReactNode
  action?: ReactNode
  size?: 'md' | 'lg'
}

export const ErrorState = ({
  title = 'Ocorreu um erro',
  message,
  icon = <div className="text-6xl mb-4">⚠️</div>,
  action,
  size = 'md',
}: ErrorStateProps) => {
  return (
    <div className="text-center py-8">
      {icon}
      <h3 className={`${size === 'lg' ? 'text-2xl' : 'text-xl'} font-semibold text-purplefy-white mb-2`}>
        {title}
      </h3>
      {message && (
        <p className="text-purplefy-light-gray mb-4">
          {message}
        </p>
      )}
      {action}
    </div>
  )
}
