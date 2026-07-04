import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — The Herb Pusher',
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="container-content py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand-charcoal mb-6">Affiliate Disclosure</h1>

      <div className="prose prose-slate max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>
          <strong>The Herb Pusher</strong> earns money through affiliate links. This means that when
          you click a link to buy a product and make a purchase, we may receive a small commission
          from the retailer at no extra cost to you.
        </p>
        <p>
          Affiliate links on this site are identified by the label <strong>"We may earn a
          commission if you buy through this link"</strong> near any purchase button.
        </p>
        <p>
          Our editorial content — including evidence ratings, buying recommendations and safety
          notes — is produced independently of commercial relationships. A product's presence in an
          affiliate link does not mean it has received a higher editorial rating than other products.
        </p>
        <p>
          Where content has been sponsored or paid for by a brand, this is clearly labelled as{' '}
          <strong>Sponsored</strong> or <strong>Partner content</strong>.
        </p>
        <p>
          We work with affiliate programmes including Amazon Associates, Awin, Partnerize and direct
          retailer agreements. Participating retailers include but are not limited to Amazon, Holland
          &amp; Barrett, iHerb and Boots.
        </p>
        <p>
          If you have any questions about how we make money, please{' '}
          <a href="/about" className="text-brand-green underline">
            see our About page
          </a>
          .
        </p>
      </div>
    </div>
  )
}
