import Script from 'next/script'

/**
 * Optional analytics — only loads when env vars are set at runtime.
 * Plausible (self-hosted or cloud):
 * - PLAUSIBLE_DOMAIN — tracked site hostname, e.g. theherbpusher.com
 * - PLAUSIBLE_SCRIPT_URL — script URL (defaults to plausible.io cloud)
 *   self-host example: https://analytics.theherbpusher.com/js/script.js
 * Google Analytics 4:
 * - GA_MEASUREMENT_ID — e.g. G-XXXXXXXXXX
 */
export function Analytics() {
  const plausibleDomain =
    process.env.PLAUSIBLE_DOMAIN || process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const plausibleScript =
    process.env.PLAUSIBLE_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL ||
    'https://plausible.io/js/script.js'
  const gaId =
    process.env.GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!plausibleDomain && !gaId) return null

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src={plausibleScript}
          strategy="afterInteractive"
        />
      )}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </>
  )
}
