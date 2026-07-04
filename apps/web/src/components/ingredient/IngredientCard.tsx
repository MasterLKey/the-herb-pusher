import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { cn, type EvidenceRating } from '@/lib/utils'

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

export function IngredientCard({
  name,
  slug,
  shortSummary,
  evidenceRating,
  category,
  className,
}: IngredientCardProps) {
  return (
    <Link
      href={`/ingredients/${slug}`}
      className={cn(
        'card-base flex flex-col gap-3 p-5 hover:shadow-md hover:border-brand-leaf transition-all group',
        className,
      )}
      aria-label={`View ${name} ingredient page`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {category && (
            <p className="text-xs text-brand-leaf font-medium uppercase tracking-wide mb-1">
              {CATEGORY_LABELS[category] ?? category}
            </p>
          )}
          <h3 className="font-bold text-brand-charcoal text-lg leading-tight group-hover:text-brand-green transition-colors">
            {name}
          </h3>
        </div>
        <ChevronRight
          className="size-5 text-gray-400 shrink-0 mt-1 group-hover:text-brand-green transition-colors"
          aria-hidden="true"
        />
      </div>

      <EvidenceBadge rating={evidenceRating} size="sm" />

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{shortSummary}</p>
    </Link>
  )
}
