import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description:
    'The Herb Pusher is an evidence-first supplement discovery site. We cut through the hype with clear evidence ratings and honest buying guides.',
}

const VALUES = [
  { icon: '🔬', heading: 'Evidence first', body: 'Every ingredient gets rated against the quality of published clinical evidence — not marketing budgets.' },
  { icon: '💬', heading: 'Plain language', body: 'No jargon, no confusing wellness-speak. If we can\'t explain it simply, we explain why it\'s complicated.' },
  { icon: '🤝', heading: 'Transparent about money', body: 'Affiliate links and sponsored content are clearly labelled. Our editorial ratings are never for sale.' },
  { icon: '⚠️', heading: 'Responsible', body: 'We include safety notes, drug interactions and proper disclaimers on every ingredient page.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-brand-green text-brand-cream py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <p className="section-label text-brand-gold mb-3">Who we are</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            About The Herb Pusher
          </h1>
          <p className="text-brand-cream/80 text-xl italic">
            &ldquo;Supplements explained without the nonsense.&rdquo;
          </p>
        </div>
      </div>

      <div className="container-content py-10 max-w-3xl">

        {/* Intro */}
        <div className="prose-brand mb-10">
          <p className="text-lg text-gray-700 leading-relaxed">
            The Herb Pusher is a supplement discovery and comparison site. We help people understand
            what vitamins, minerals, herbs and other supplements may support — and where to buy
            quality products at a fair price.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            We believe the supplement market has a serious hype problem. Many products are
            over-marketed, poorly evidenced and overpriced. The Herb Pusher exists to cut through
            that noise with clear evidence ratings, honest product comparisons and straightforward
            buying guides.
          </p>
        </div>

        {/* Values grid */}
        <section aria-labelledby="values-heading" className="mb-12">
          <h2 id="values-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-6">
            How we work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map(({ icon, heading, body }) => (
              <div key={heading} className="card-base p-5 flex gap-4">
                <span className="text-2xl shrink-0" aria-hidden="true">{icon}</span>
                <div>
                  <h3 className="font-heading font-bold text-brand-charcoal mb-1">{heading}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue model */}
        <section aria-labelledby="revenue-heading" className="mb-10">
          <h2 id="revenue-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
            How we make money
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            The Herb Pusher earns revenue through affiliate links. When you buy a product through a
            link on our site, we may receive a small commission from the retailer. This doesn&apos;t
            affect the price you pay, and it does not influence our editorial ratings or
            recommendations.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We also accept sponsorship from brands for enhanced product placements. Sponsored content
            is always clearly labelled.
          </p>
          <Link href="/affiliate-disclosure" className="btn-secondary inline-flex">
            Read our full affiliate disclosure
          </Link>
        </section>

        {/* Medical approach */}
        <section aria-labelledby="medical-heading" className="mb-10">
          <h2 id="medical-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
            Our approach to health claims
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            The Herb Pusher is not a medical site. We do not diagnose, treat or cure any medical
            condition. We use wellness-support language throughout, and we only publish authorised
            health claims from the GB register where applicable.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Every ingredient page goes through an evidence review and compliance check before
            publication.
          </p>
          <Link href="/editorial-policy" className="btn-secondary inline-flex">
            Read our editorial policy
          </Link>
        </section>

        {/* Quick links */}
        <div className="divider pt-8 mt-4">
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/editorial-policy', label: 'Editorial Policy' },
              { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
              { href: '/disclaimer', label: 'Disclaimer' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 text-sm text-brand-green font-medium hover:underline"
              >
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
