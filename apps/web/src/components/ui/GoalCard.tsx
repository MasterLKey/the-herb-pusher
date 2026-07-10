import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
  heart: '❤️',
  joints: '🦵',
  mood: '🌤️',
}

const GOAL_BG: Record<string, string> = {
  sleep: 'bg-indigo-50 border-indigo-200',
  energy: 'bg-amber-50 border-amber-200',
  focus: 'bg-blue-50 border-blue-200',
  immune: 'bg-brand-sage border-brand-leaf/30',
  gut: 'bg-emerald-50 border-emerald-200',
  bone: 'bg-stone-50 border-stone-200',
  muscle: 'bg-rose-50 border-rose-200',
  skin: 'bg-pink-50 border-pink-200',
  stress: 'bg-violet-50 border-violet-200',
  wellbeing: 'bg-red-50 border-red-200',
  heart: 'bg-red-50 border-red-200',
  joints: 'bg-orange-50 border-orange-200',
  mood: 'bg-yellow-50 border-yellow-200',
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
  const iconKey = icon ?? 'wellbeing'
  const iconEmoji = GOAL_ICONS[iconKey] ?? '🌿'
  const bgClass = GOAL_BG[iconKey] ?? 'bg-brand-sage border-brand-leaf/30'

  return (
    <Link
      href={`/goals/${slug}`}
      className={cn(
        'group flex flex-col gap-3 p-5 rounded-[var(--radius-card)] border transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        bgClass,
        className,
      )}
      aria-label={`Browse ${name} supplements`}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl leading-none" aria-hidden="true">{iconEmoji}</span>
        <ArrowRight
          className="size-4 text-gray-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all mt-0.5"
          aria-hidden="true"
        />
      </div>

      <div>
        <h3 className="font-heading font-bold text-brand-charcoal group-hover:text-brand-green transition-colors leading-tight">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mt-1 leading-snug line-clamp-2">{shortDescription}</p>
      </div>

      {ingredientCount != null && ingredientCount > 0 && (
        <p className="text-xs font-semibold text-brand-green mt-auto">
          {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''}
        </p>
      )}
    </Link>
  )
}
