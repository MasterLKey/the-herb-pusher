import { cn, EVIDENCE_RATING_CONFIG, type EvidenceRating } from '@/lib/utils'

interface EvidenceBadgeProps {
  rating: EvidenceRating
  size?: 'sm' | 'md' | 'lg'
  showDescription?: boolean
  className?: string
}

export function EvidenceBadge({
  rating,
  size = 'md',
  showDescription = false,
  className,
}: EvidenceBadgeProps) {
  const config = EVIDENCE_RATING_CONFIG[rating]
  if (!config) return null

  return (
    <div className={cn('inline-block', className)}>
      <span
        data-evidence-rating={rating}
        className={cn(
          'badge-pill',
          config.colour,
          {
            'text-xs px-2 py-0.5': size === 'sm',
            'text-xs px-2.5 py-0.5': size === 'md',
            'text-sm px-3 py-1': size === 'lg',
          },
        )}
        aria-label={`Evidence rating: ${config.label}`}
        title={config.description}
      >
        <span aria-hidden="true">{config.icon}</span>
        {config.label}
      </span>
      {showDescription && (
        <p className="mt-1 text-xs text-gray-600">{config.description}</p>
      )}
    </div>
  )
}
