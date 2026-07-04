'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterSignupBoxProps {
  source?: string
  variant?: 'default' | 'compact'
  className?: string
}

export function NewsletterSignupBox({
  source = 'homepage',
  variant = 'default',
  className,
}: NewsletterSignupBoxProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn('card-base p-6 text-center', className)}>
        <p className="text-2xl mb-2" aria-hidden="true">✓</p>
        <p className="font-semibold text-brand-green">You're in.</p>
        <p className="text-sm text-gray-600 mt-1">
          One useful supplement tip. No wellness waffle. Coming to your inbox soon.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-brand-green text-brand-cream rounded-[var(--radius-card)] p-6 md:p-8',
        variant === 'compact' ? 'p-5' : '',
        className,
      )}
    >
      {variant === 'default' && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="size-5 text-brand-gold" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              The Friday Fix
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">One useful supplement tip. No wellness waffle.</h2>
          <p className="text-sm text-brand-cream/80 mb-4">
            Join readers who want the good stuff without the hype. Every Friday.
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          className="flex-1 px-4 py-2.5 rounded-[var(--radius-btn)] bg-brand-cream/10 border border-brand-cream/20 text-brand-cream placeholder:text-brand-cream/50 focus:outline-none focus:border-brand-cream/60 disabled:opacity-50"
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="bg-brand-gold hover:bg-brand-gold/90 text-brand-charcoal font-semibold px-5 py-2.5 rounded-[var(--radius-btn)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Signing up…' : 'Get the Friday Fix'}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-sm text-brand-gold mt-2" role="alert">
          {errorMsg}
        </p>
      )}

      <p className="text-xs text-brand-cream/50 mt-3">
        No spam. Unsubscribe any time.{' '}
        <a href="/affiliate-disclosure" className="underline hover:text-brand-cream">
          Affiliate disclosure
        </a>
      </p>
    </div>
  )
}
