import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn, EVIDENCE_RATING_CONFIG, type EvidenceRating } from '@/lib/utils'

interface IngredientCardProps {
  name: string
  slug: string
  shortSummary: string
  evidenceRating: EvidenceRating
  category?: string
  className?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  vitamin: 'Vitamin',
  mineral: 'Mineral',
  herb: 'Herb',
  amino_acid: 'Amino Acid',
  fatty_acid: 'Fatty Acid',
  probiotic: 'Probiotic',
  mushroom: 'Mushroom',
  other: 'Supplement',
}

const EVIDENCE_BORDER: Record<EvidenceRating, string> = {
  strong: 'border-l-brand-green',
  moderate: 'border-l-brand-leaf',
  early: 'border-l-brand-gold',
  traditional: 'border-l-brand-clay',
  hype: 'border-l-brand-charcoal',
}

export function IngredientCard({
  name,
  slug,
  shortSummary,
  evidenceRating,
  category,
  className,
}: IngredientCardProps) {
  const config = EVIDENCE_RATING_CONFIG[evidenceRating]

  return (
    <Link
      href={`/ingredients/${slug}`}
      className={cn(
        'card-trading flex flex-col gap-0 p-0 overflow-hidden border-l-4 group',
        EVIDENCE_BORDER[evidenceRating],
        className,
      )}
      aria-label={`View ${name} — ${config?.label ?? ''}`}
    >
      {/* Top: category + arrow */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {category ? (
          <span className="section-label">
            {CATEGORY_LABELS[category] ?? category}
          </span>
        ) : (
          <span />
        )}
        <ArrowRight
          className="size-4 text-gray-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all"
          aria-hidden="true"
        />
      </div>

      {/* Name */}
      <div className="px-4 pb-2">
        <h3 className="font-heading font-bold text-lg text-brand-charcoal leading-tight group-hover:text-brand-green transition-colors">
          {name}
        </h3>
      </div>

      {/* Evidence badge */}
      <div className="px-4 pb-3">
        <EvidenceBadge rating={evidenceRating} size="sm" />
      </div>

      {/* Summary */}
      <div className="px-4 pb-4 mt-auto">
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{shortSummary}</p>
      </div>
    </Link>
  )
}
