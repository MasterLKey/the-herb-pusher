import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'How The Herb Pusher earns money and how that affects our editorial content.',
}

export default function AffiliateDisclosurePage() {
  return (
    <>
      <div className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <p className="section-label text-brand-gold mb-3">Transparency</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Affiliate Disclosure</h1>
          <p className="text-brand-cream/70 text-lg">
            Some links on this site may earn us a commission. Here&apos;s exactly how that works.
          </p>
        </div>
      </div>

      <div className="container-content py-10 max-w-3xl">
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div className="safety-box">
            <p className="font-semibold text-brand-charcoal mb-1">The short version</p>
            <p className="text-sm">
              We may earn a commission if you buy through a link on this site. This never affects
              the price you pay. It never affects our editorial ratings, reviews or
              recommendations. Sponsored content is always clearly labelled.
            </p>
          </div>

          <h2 className="text-2xl font-heading font-bold text-brand-charcoal pt-2">How affiliate links work</h2>
          <p>
            <strong>The Herb Pusher</strong> earns money through affiliate links. This means that when
            you click a link to buy a product and make a purchase, we may receive a small commission
            from the retailer at no extra cost to you.
          </p>
          <p>
            Affiliate links on this site are identified by disclosure text near any purchase button,
            such as{' '}
            <em>&ldquo;We may earn a commission if you buy through this link&rdquo;</em>.
          </p>

          <h2 className="text-2xl font-heading font-bold text-brand-charcoal pt-2">How this affects our content</h2>
          <p>
            Our editorial content — including evidence ratings, buying recommendations and safety
            notes — is produced independently of commercial relationships. A product&apos;s
            presence in an affiliate link does not mean it has received a higher editorial rating
            than other products.
          </p>

          <h2 className="text-2xl font-heading font-bold text-brand-charcoal pt-2">Sponsored content</h2>
          <p>
            Where content has been sponsored or paid for by a brand, this is clearly labelled as{' '}
            <strong>Sponsored</strong> or <strong>Partner content</strong>. Sponsored placements
            never affect our evidence ratings or ingredient assessments.
          </p>

          <h2 className="text-2xl font-heading font-bold text-brand-charcoal pt-2">Affiliate programmes</h2>
          <p>
            We work with affiliate programmes including Amazon Associates, Awin, Partnerize and
            direct retailer agreements. Participating retailers include but are not limited to
            Amazon, Holland &amp; Barrett, iHerb and Boots.
          </p>

          <div className="info-box mt-6">
            <p className="text-sm">
              Questions about how we make money?{' '}
              <Link href="/about" className="font-medium underline hover:text-brand-green">
                See our About page.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
