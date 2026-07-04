import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-cream/80 mt-16">
      <div className="container-content py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-brand-gold text-2xl" aria-hidden="true">⬡</span>
              <span className="font-bold text-lg text-brand-cream">The Herb Pusher</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Supplements explained without the nonsense. We help you understand what vitamins,
              minerals and herbs may support — and where to buy quality products.
            </p>
            <p className="text-xs text-brand-cream/50">
              The Herb Pusher does not diagnose, treat or cure medical conditions. Content is for
              general information only. Always speak to a qualified healthcare professional before
              starting supplements.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h3 className="font-semibold text-brand-cream mb-3 text-sm uppercase tracking-wide">
              Discover
            </h3>
            <nav aria-label="Discover links">
              <ul className="space-y-2 text-sm">
                <li><Link href="/ingredients" className="hover:text-brand-gold transition-colors">Ingredient Database</Link></li>
                <li><Link href="/products" className="hover:text-brand-gold transition-colors">Products</Link></li>
                <li><Link href="/goals" className="hover:text-brand-gold transition-colors">Wellness Goals</Link></li>
                <li><Link href="/guides" className="hover:text-brand-gold transition-colors">Buying Guides</Link></li>
                <li><Link href="/search" className="hover:text-brand-gold transition-colors">Search</Link></li>
              </ul>
            </nav>
          </div>

          {/* Trust */}
          <div>
            <h3 className="font-semibold text-brand-cream mb-3 text-sm uppercase tracking-wide">
              Trust & Policies
            </h3>
            <nav aria-label="Policy links">
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                <li><Link href="/affiliate-disclosure" className="hover:text-brand-gold transition-colors">Affiliate Disclosure</Link></li>
                <li><Link href="/editorial-policy" className="hover:text-brand-gold transition-colors">Editorial Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-brand-gold transition-colors">Disclaimer</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="border-t border-brand-cream/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-cream/40">
          <p>© {new Date().getFullYear()} The Herb Pusher. All rights reserved.</p>
          <p>
            Some links on this site are affiliate links.{' '}
            <Link href="/affiliate-disclosure" className="underline hover:text-brand-gold">
              Our opinions are always our own.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
