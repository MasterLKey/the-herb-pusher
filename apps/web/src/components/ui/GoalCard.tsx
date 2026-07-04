import Link from 'next/link'
import { cn } from '@/lib/utils'

const GOAL_ICONS: Record<string, string> = {
  sleep: '🌙',
  energy: '⚡',
  focus: '🧠',
  immune: '🛡️',
  gut: '🌿',
  bone: '🦴',
  muscle: '💪',
  skin: '✨',
  stress: '🧘',
  wellbeing: '❤️',
}

interface GoalCardProps {
  name: string
  slug: string
  icon?: string
  shortDescription: string
  ingredientCount?: number
  className?: string
}

export function GoalCard({
  name,
  slug,
  icon,
  shortDescription,
  ingredientCount,
  className,
}: GoalCardProps) {
  return (
    <Link
      href={`/goals/${slug}`}
      className={cn(
        'card-base flex flex-col items-start gap-3 p-5 hover:shadow-md hover:border-brand-leaf transition-all group',
        className,
      )}
      aria-label={`Browse ${name} supplements`}
    >
      <span className="text-3xl" aria-hidden="true">
        {icon ? GOAL_ICONS[icon] ?? '🌿' : '🌿'}
      </span>
      <div>
        <h3 className="font-bold text-brand-charcoal group-hover:text-brand-green transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mt-1 leading-snug">{shortDescription}</p>
      </div>
      {ingredientCount != null && ingredientCount > 0 && (
        <p className="text-xs text-brand-leaf font-medium">
          {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''}
        </p>
      )}
    </Link>
  )
}
