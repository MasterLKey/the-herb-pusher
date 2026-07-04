import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — The Herb Pusher',
}

export default function AboutPage() {
  return (
    <div className="container-content py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand-charcoal mb-2">About The Herb Pusher</h1>
      <p className="text-brand-leaf font-medium mb-6">Supplements explained without the nonsense.</p>

      <div className="prose prose-slate max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>
          The Herb Pusher is a supplement discovery and comparison site. We help people understand
          what vitamins, minerals, herbs and other supplements may support — and where to buy
          quality products at a fair price.
        </p>
        <p>
          We believe the supplement market has a serious hype problem. Many products are
          over-marketed, poorly evidenced and overpriced. The Herb Pusher exists to cut through
          that noise with clear evidence ratings, honest product comparisons and straightforward
          buying guides.
        </p>

        <h2 className="text-lg font-bold">How we make money</h2>
        <p>
          The Herb Pusher earns revenue through affiliate links. When you buy a product through a
          link on our site, we may receive a small commission from the retailer. This doesn't
          affect the price you pay, and it does not influence our editorial ratings or
          recommendations.
        </p>
        <p>
          We also accept sponsorship from brands for enhanced product placements. Sponsored content
          is always clearly labelled.{' '}
          <Link href="/affiliate-disclosure" className="text-brand-green underline">
            Read our full affiliate disclosure.
          </Link>
        </p>

        <h2 className="text-lg font-bold">Our approach to health claims</h2>
        <p>
          The Herb Pusher is not a medical site. We do not diagnose, treat or cure any medical
          condition. We use wellness-support language throughout, and we only publish authorised
          health claims from the GB register where applicable.
        </p>
        <p>
          Every ingredient page goes through an evidence review and compliance check before
          publication.{' '}
          <Link href="/editorial-policy" className="text-brand-green underline">
            Read our editorial policy.
          </Link>
        </p>
      </div>
    </div>
  )
}
