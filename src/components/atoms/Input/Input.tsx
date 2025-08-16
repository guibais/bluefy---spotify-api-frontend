import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Search, X } from 'lucide-react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  showSearch?: boolean
  onClear?: () => void
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    showSearch = false, 
    onClear, 
    fullWidth = true,
    value,
    ...props 
  }, ref) => {
    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-spotify-light-gray mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {showSearch && (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-light-gray w-5 h-5" />
          )}
          <input
            ref={ref}
            className={clsx(
              'input-field',
              showSearch && 'pl-10',
              value && onClear && 'pr-10',
              error && 'border-accent-500 focus:border-accent-500 focus:ring-accent-500',
              className
            )}
            value={value}
            {...props}
          />
          {value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spotify-light-gray hover:text-spotify-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {error && (
          <span className="text-sm text-accent-500 mt-1">{error}</span>
        )}
      </div>
    )
  }
)
