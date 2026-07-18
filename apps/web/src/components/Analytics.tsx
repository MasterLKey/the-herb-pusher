import Script from 'next/script'

/**
 * Optional analytics — only loads when env vars are set at runtime.
 *
 * Plausible CE (hashed tracker script from site settings):
 * - PLAUSIBLE_SCRIPT_URL — e.g. https://analytics.theherbpusher.com/js/pa-….js
 *
 * Google Analytics 4:
 * - GA_MEASUREMENT_ID — e.g. G-XXXXXXXXXX
 */
export function Analytics() {
  const plausibleScript =
    process.env.PLAUSIBLE_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL
  const gaId =
    process.env.GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!plausibleScript && !gaId) return null

  return (
    <>
      {plausibleScript && (
        <>
          <Script async src={plausibleScript} strategy="afterInteractive" />
          <Script id="plausible-init" strategy="afterInteractive">
            {`
              window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
              plausible.init()
            `}
          </Script>
        </>
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
