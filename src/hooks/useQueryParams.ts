import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback } from 'react'

export const useQueryParams = <T extends Record<string, any>>() => {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })

  const updateParams = useCallback((updates: Partial<T>) => {
    const newSearch = { ...search, ...updates }
    
    Object.keys(newSearch).forEach(key => {
      if (newSearch[key] === '' || newSearch[key] === null || newSearch[key] === undefined) {
        delete newSearch[key]
      }
    })

    navigate({ search: newSearch as any })
  }, [navigate, search])

  const clearParams = useCallback(() => {
    navigate({ search: {} as any })
  }, [navigate])

  return {
    params: search as T,
    updateParams,
    clearParams,
  }
}
