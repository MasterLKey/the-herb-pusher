import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Policy — The Herb Pusher',
}

export default function EditorialPolicyPage() {
  return (
    <div className="container-content py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand-charcoal mb-6">Editorial Policy</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-gray-700 leading-relaxed">
        <h2 className="text-lg font-bold">Independence</h2>
        <p>
          The Herb Pusher's editorial content — including evidence ratings, product recommendations
          and safety notes — is produced independently of any commercial relationships. We do not
          accept payment to improve a product's editorial rating.
        </p>

        <h2 className="text-lg font-bold">Evidence standards</h2>
        <p>
          Our evidence ratings are based on the quality and quantity of available clinical
          research. We use a five-level scale: Strong Evidence, Moderate Evidence, Early
          Evidence, Traditional Use and Hype Alert. Evidence ratings are reviewed when new
          research is published.
        </p>

        <h2 className="text-lg font-bold">Health claims</h2>
        <p>
          We only use authorised health claims from the Great Britain nutrition and health claims
          register where applicable. We do not publish claims that imply a product can diagnose,
          treat, prevent or cure any medical condition. Wellness-support language is used
          throughout in line with UK food supplement marketing guidance.
        </p>

        <h2 className="text-lg font-bold">Compliance review</h2>
        <p>
          Every ingredient page goes through an internal compliance review before publication.
          Benefit claims are reviewed for accuracy, legal compliance and appropriate sourcing.
          Pages are given a "last reviewed" date and scheduled for re-review.
        </p>

        <h2 className="text-lg font-bold">Sponsored content</h2>
        <p>
          Any content paid for by a brand is clearly labelled as Sponsored or Partner content.
          Sponsored content is held to the same factual accuracy standards as editorial content.
        </p>

        <h2 className="text-lg font-bold">Corrections</h2>
        <p>
          If you believe any content on this site is inaccurate, please contact us. We take
          corrections seriously and will update content promptly where errors are identified.
        </p>
      </div>
    </div>
  )
}
