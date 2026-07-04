'use client'

import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AffiliateButtonProps {
  href: string
  retailerName: string
  price?: string
  className?: string
  variant?: 'primary' | 'secondary'
}

export function AffiliateButton({
  href,
  retailerName,
  price,
  className,
  variant = 'primary',
}: AffiliateButtonProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener sponsored"
        className={cn(
          'inline-flex items-center gap-2',
          variant === 'primary' ? 'btn-primary' : 'btn-secondary',
        )}
        aria-label={`Check price at ${retailerName} (opens in new tab, affiliate link)`}
      >
        {price && <span className="font-bold">{price}</span>}
        <span>Check price at {retailerName}</span>
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </a>
      <p className="text-xs text-gray-500">
        We may earn a commission if you buy through this link.{' '}
        <a href="/affiliate-disclosure" className="underline hover:text-brand-green">
          Learn more
        </a>
      </p>
    </div>
  )
}
