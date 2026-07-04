import { cn } from '@/lib/utils'

interface SponsoredLabelProps {
  className?: string
  variant?: 'inline' | 'banner'
}

export function SponsoredLabel({ className, variant = 'inline' }: SponsoredLabelProps) {
  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'bg-brand-sage border border-brand-leaf/30 rounded-md px-3 py-2 text-xs text-gray-600',
          className,
        )}
        aria-label="Sponsored content disclosure"
      >
        <span className="font-semibold text-brand-green">Sponsored</span> — This brand paid for
        enhanced placement. Our editorial rating is independent.
      </div>
    )
  }

  return (
    <span
      className={cn(
        'badge-pill bg-brand-sage text-brand-charcoal border border-brand-sage',
        className,
      )}
      aria-label="Sponsored placement"
    >
      Sponsored
    </span>
  )
}
