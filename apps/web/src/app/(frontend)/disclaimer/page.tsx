import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer — The Herb Pusher',
}

export default function DisclaimerPage() {
  return (
    <div className="container-content py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand-charcoal mb-6">Disclaimer</h1>
      <div className="prose prose-slate max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>
          The information published on The Herb Pusher is provided for general educational and
          informational purposes only. It is not intended as, and should not be treated as, medical
          advice.
        </p>
        <p>
          The Herb Pusher does not diagnose, treat, cure or prevent any medical condition or
          disease. Nothing on this site should be used as a substitute for professional medical
          advice, diagnosis or treatment from a qualified healthcare provider.
        </p>
        <p>
          Always consult a GP, pharmacist or qualified healthcare professional before taking any
          supplement, particularly if you are pregnant, breastfeeding, taking prescribed
          medication, or managing an existing health condition.
        </p>
        <p>
          Supplement regulations, product formulations and evidence bases change over time. While we
          aim to keep information up to date, we cannot guarantee that all content reflects the
          most current research or regulatory position.
        </p>
        <p>
          We make no representations or warranties about the accuracy, completeness or suitability
          of any information on this site for any particular purpose.
        </p>
      </div>
    </div>
  )
}
