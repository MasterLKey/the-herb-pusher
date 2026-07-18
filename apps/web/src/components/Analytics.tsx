import Script from 'next/script'

/**
 * Optional analytics — only loads when env vars are set at runtime.
 * Prefer server-only names so keys work without a rebuild:
 * - PLAUSIBLE_DOMAIN (or NEXT_PUBLIC_PLAUSIBLE_DOMAIN)
 * - GA_MEASUREMENT_ID (or NEXT_PUBLIC_GA_MEASUREMENT_ID)
 */
export function Analytics() {
  const plausibleDomain =
    process.env.PLAUSIBLE_DOMAIN || process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const gaId =
    process.env.GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!plausibleDomain && !gaId) return null

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
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
