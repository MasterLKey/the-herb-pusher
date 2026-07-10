'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Menu, X, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/ingredients', label: 'Ingredients' },
  { href: '/goals', label: 'Goals' },
  { href: '/guides', label: 'Guides' },
  { href: '/products', label: 'Products' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-green text-brand-cream">
        <div className="container-content">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity shrink-0"
              aria-label="The Herb Pusher — home"
            >
              <span className="flex items-center justify-center w-8 h-8 bg-brand-gold rounded-lg shrink-0" aria-hidden="true">
                <Leaf className="size-4 text-brand-charcoal" />
              </span>
              <span className="hidden sm:block font-heading">The Herb Pusher</span>
              <span className="sm:hidden font-heading">THP</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-cream/15 text-brand-cream'
                        : 'text-brand-cream/80 hover:text-brand-cream hover:bg-brand-cream/10',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="flex items-center gap-1.5 bg-brand-cream/10 hover:bg-brand-cream/20 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                aria-label="Search the site"
              >
                <Search className="size-4" aria-hidden="true" />
                <span className="hidden sm:block">Search</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-brand-cream/10 transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? (
                  <X className="size-5" aria-hidden="true" />
                ) : (
                  <Menu className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — slide down */}
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden bg-brand-charcoal text-brand-cream overflow-hidden transition-all duration-300 ease-in-out',
            mobileOpen ? 'max-h-screen border-t border-brand-cream/10' : 'max-h-0',
          )}
          aria-hidden={!mobileOpen}
        >
          <nav className="container-content py-4" aria-label="Mobile navigation">
            <ul className="space-y-1 mb-4">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center py-3 px-4 rounded-lg text-base font-medium transition-colors',
                        isActive
                          ? 'bg-brand-green text-brand-cream'
                          : 'text-brand-cream/80 hover:text-brand-cream hover:bg-brand-cream/10',
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="pt-4 border-t border-brand-cream/10">
              <p className="text-xs text-brand-cream/40 px-4">
                Supplements explained without the nonsense.
              </p>
            </div>
          </nav>
        </div>
      </header>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
