'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  size?: 'default' | 'hero'
  initialQuery?: string
  className?: string
  placeholder?: string
}

export function SearchBar({
  size = 'default',
  initialQuery = '',
  className,
  placeholder = "Search magnesium, turmeric, lion's mane…",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleClear() {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex items-center', className)}
      role="search"
      aria-label="Search ingredients, products and guides"
    >
      <label htmlFor="site-search" className="sr-only">
        Search supplements
      </label>
      <Search
        className={cn(
          'absolute left-4 shrink-0 text-gray-400 pointer-events-none',
          size === 'hero' ? 'size-5' : 'size-4',
        )}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-white border border-brand-sage rounded-[var(--radius-btn)] text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all',
          size === 'hero'
            ? 'pl-12 pr-20 py-4 text-base shadow-md'
            : 'pl-10 pr-16 py-2.5 text-sm',
        )}
        aria-label={placeholder}
        autoComplete="off"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute right-14 text-gray-400 hover:text-brand-charcoal transition-colors',
            size === 'hero' ? 'right-16' : 'right-14',
          )}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        type="submit"
        className={cn(
          'absolute right-2 btn-primary',
          size === 'hero' ? 'px-4 py-2' : 'px-3 py-1.5 text-xs',
        )}
        aria-label="Submit search"
      >
        Search
      </button>
    </form>
  )
}
