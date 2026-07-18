import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function syncToMailerLite(email: string): Promise<void> {
  const apiKey = process.env.MAILERLITE_API_KEY
  if (!apiKey) return

  const groupId = process.env.MAILERLITE_GROUP_ID
  const body: { email: string; groups?: string[]; status: string } = {
    email,
    status: 'active',
  }
  if (groupId) body.groups = [groupId]

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`MailerLite sync failed (${res.status}):`, text)
  }
}

export async function POST(req: NextRequest) {
  let normalised = ''

  try {
    const { email, source } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    normalised = email.toLowerCase().trim()
    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email: normalised,
        source: source ?? 'other',
        subscribedAt: new Date().toISOString(),
        active: true,
      },
    })

    // Fire-and-forget MailerLite when configured; local DB is source of truth
    void syncToMailerLite(normalised)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    if (err?.message?.includes('duplicate') || err?.code === '23505') {
      if (normalised) void syncToMailerLite(normalised)
      return NextResponse.json({ ok: true })
    }
    console.error('Newsletter subscribe error:', err)
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 })
  }
}
