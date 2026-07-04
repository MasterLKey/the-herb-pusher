'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Target, BookOpen, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/search', label: 'Search', Icon: Search },
  { href: '/goals', label: 'Goals', Icon: Target },
  { href: '/guides', label: 'Guides', Icon: BookOpen },
  { href: '/saved', label: 'Saved', Icon: Bookmark },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-cream border-t border-brand-sage pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-brand-green'
                  : 'text-gray-500 hover:text-brand-green',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn('size-5', isActive ? 'text-brand-green' : 'text-gray-400')}
                aria-hidden="true"
              />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
