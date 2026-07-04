import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email: email.toLowerCase().trim(),
        source: source ?? 'other',
        subscribedAt: new Date().toISOString(),
        active: true,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    if (err?.message?.includes('duplicate') || err?.code === '23505') {
      return NextResponse.json({ ok: true })
    }
    console.error('Newsletter subscribe error:', err)
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 })
  }
}
