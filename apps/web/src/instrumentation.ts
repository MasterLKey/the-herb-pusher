// Runs once on server startup, before any requests are served.
// Warms up the Payload connection so the first request is not cold.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'edge') {
    const { getPayload } = await import('payload')
    const { default: config } = await import('@payload-config')
    await getPayload({ config })
  }
}
