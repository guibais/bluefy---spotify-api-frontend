import { useState, useEffect } from 'react'
import { Input } from '@/components/atoms'
import { useDebounce } from '@/hooks/useDebounce'
import * as m from '@/paraglide/messages.js'

type SearchBarProps = {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
  className?: string
}

export const SearchBar = ({ 
  placeholder = m.search_placeholder_artists(), 
  onSearch, 
  initialValue = "",
  className 
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleClear = () => {
    setQuery("")
  }

  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      showSearch
      onClear={query ? handleClear : undefined}
      className={className}
    />
  )
}
