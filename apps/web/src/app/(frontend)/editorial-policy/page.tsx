import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description:
    'How The Herb Pusher produces content, rates evidence and handles health claims. Our commitment to accuracy and independence.',
}

const SECTIONS = [
  {
    heading: 'Independence',
    body: `The Herb Pusher's editorial content — including evidence ratings, product recommendations
and safety notes — is produced independently of any commercial relationships. We do not
accept payment to improve a product's editorial rating or evidence assessment.`,
  },
  {
    heading: 'Evidence standards',
    body: `Our evidence ratings are based on the quality and quantity of available clinical
research. We use a five-level scale: Strong Evidence, Moderate Evidence, Early
Evidence, Traditional Use and Hype Alert. Evidence ratings are reviewed when new
significant research is published or when scheduled review dates are reached.`,
  },
  {
    heading: 'Health claims',
    body: `We only use authorised health claims from the Great Britain nutrition and health claims
register where applicable. We do not publish claims that imply a product can diagnose,
treat, prevent or cure any medical condition. Wellness-support language is used
throughout in line with UK food supplement marketing guidance.`,
  },
  {
    heading: 'Compliance review',
    body: `Every ingredient page goes through an internal evidence review and compliance check
before publication. Benefit claims are reviewed for accuracy, legal compliance and
appropriate sourcing. Pages are given a "last reviewed" date and scheduled for
re-review when the date falls due or when new evidence becomes available.`,
  },
  {
    heading: 'Sponsored content',
    body: `Any content paid for by a brand is clearly labelled as Sponsored or Partner content.
Sponsored content is held to the same factual accuracy standards as editorial content.
A brand's commercial relationship with us never affects our evidence ratings.`,
  },
  {
    heading: 'Corrections',
    body: `If you believe any content on this site is inaccurate, please contact us. We take
corrections seriously and will update content promptly where errors are identified.
Significant corrections are noted on the relevant page.`,
  },
]

export default function EditorialPolicyPage() {
  return (
    <>
      <div className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <p className="section-label text-brand-gold mb-3">How we work</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Editorial Policy
          </h1>
          <p className="text-brand-cream/70 text-lg">
            Our commitment to accuracy, independence and responsible health information.
          </p>
        </div>
      </div>

      <div className="container-content py-10 max-w-3xl">
        <div className="space-y-8">
          {SECTIONS.map(({ heading, body }) => (
            <section key={heading} className="border-l-2 border-brand-leaf pl-5">
              <h2 className="text-xl font-heading font-bold text-brand-charcoal mb-2">
                {heading}
              </h2>
              <p className="text-gray-700 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
