import Link from 'next/link'
import { Search, Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand-green text-brand-cream shadow-md">
      <div className="container-content">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
            aria-label="The Herb Pusher — home"
          >
            <span className="text-brand-gold text-2xl leading-none" aria-hidden="true">⬡</span>
            <span className="hidden sm:block">The Herb Pusher</span>
            <span className="sm:hidden">THP</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
            <Link href="/ingredients" className="hover:text-brand-gold transition-colors">
              Ingredients
            </Link>
            <Link href="/goals" className="hover:text-brand-gold transition-colors">
              Goals
            </Link>
            <Link href="/guides" className="hover:text-brand-gold transition-colors">
              Guides
            </Link>
            <Link href="/products" className="hover:text-brand-gold transition-colors">
              Products
            </Link>
          </nav>

          {/* Search + CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="flex items-center gap-2 bg-brand-cream/10 hover:bg-brand-cream/20 rounded-lg px-3 py-2 text-sm transition-colors"
              aria-label="Search the site"
            >
              <Search className="size-4" aria-hidden="true" />
              <span className="hidden sm:block">Search</span>
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-brand-cream/10 transition-colors"
              aria-label="Open menu"
              aria-expanded="false"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
