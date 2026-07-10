import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Important disclaimer about the information on The Herb Pusher. This site is for educational purposes only and is not a substitute for medical advice.',
}

export default function DisclaimerPage() {
  return (
    <>
      <div className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <p className="section-label text-brand-gold mb-3">Important information</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Disclaimer</h1>
          <p className="text-brand-cream/70 text-lg">
            Please read before using any information on this site.
          </p>
        </div>
      </div>

      <div className="container-content py-10 max-w-3xl">
        <div className="caution-box mb-8">
          <p className="font-heading font-bold text-brand-charcoal mb-1">
            This is not medical advice.
          </p>
          <p className="text-sm leading-relaxed">
            The Herb Pusher does not diagnose, treat, cure or prevent any medical condition or disease.
            Nothing on this site should be used as a substitute for professional medical advice,
            diagnosis or treatment.
          </p>
        </div>

        <div className="space-y-5 text-gray-700 leading-relaxed">
          <p>
            The information published on The Herb Pusher is provided for general educational and
            informational purposes only. It is not intended as, and should not be treated as, medical
            advice.
          </p>
          <p>
            Always consult a GP, pharmacist or qualified healthcare professional before taking any
            supplement, particularly if you are:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Pregnant or breastfeeding</li>
            <li>Taking prescribed medication (risk of interactions)</li>
            <li>Managing an existing health condition</li>
            <li>Under 18 years old</li>
            <li>Due for surgery within the next few weeks</li>
          </ul>
          <p>
            Supplement regulations, product formulations and evidence bases change over time. While we
            aim to keep information up to date, we cannot guarantee that all content reflects the
            most current research or regulatory position.
          </p>
          <p>
            We make no representations or warranties about the accuracy, completeness or suitability
            of any information on this site for any particular purpose. Use of this site is at your
            own risk.
          </p>
        </div>
      </div>
    </>
  )
}
