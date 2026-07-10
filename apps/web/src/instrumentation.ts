// Runs once on server startup, before any requests are served.
// Forces Payload to initialise (and push the DB schema when push:true)
// so the DB tables exist before the first request hits a page.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    await getPayload({ config: configPromise.default })
  }
}
