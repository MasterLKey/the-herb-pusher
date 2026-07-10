import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GoalCard } from '@/components/ui/GoalCard'
import { Target } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Wellness Goals',
  description:
    'Browse supplements by wellness goal — sleep, energy, immune support, gut health and more. Evidence-rated ingredients for every goal.',
}

const STATIC_GOALS = [
  { id: 'sleep', name: 'Sleep', slug: 'sleep', icon: 'sleep', shortDescription: 'Support deeper, more restful sleep naturally.', ingredientCount: 0 },
  { id: 'energy', name: 'Energy', slug: 'energy', icon: 'energy', shortDescription: 'Fight fatigue and stay sharp all day.', ingredientCount: 0 },
  { id: 'focus', name: 'Focus', slug: 'focus', icon: 'focus', shortDescription: 'Sharpen concentration and mental clarity.', ingredientCount: 0 },
  { id: 'immune', name: 'Immune', slug: 'immune', icon: 'immune', shortDescription: 'Keep your defences up year-round.', ingredientCount: 0 },
  { id: 'gut', name: 'Gut Health', slug: 'gut', icon: 'gut', shortDescription: 'Support digestion and your microbiome.', ingredientCount: 0 },
  { id: 'bone', name: 'Bone', slug: 'bone', icon: 'bone', shortDescription: 'Build and maintain strong bones.', ingredientCount: 0 },
  { id: 'muscle', name: 'Muscle', slug: 'muscle', icon: 'muscle', shortDescription: 'Support recovery and strength gains.', ingredientCount: 0 },
  { id: 'skin', name: 'Skin', slug: 'skin', icon: 'skin', shortDescription: 'Nourish skin from the inside out.', ingredientCount: 0 },
]

export default async function GoalsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'wellness-goals', limit: 50, depth: 1 })
  const goals = result.docs.length > 0 ? result.docs : STATIC_GOALS

  return (
    <>
      {/* Hero */}
      <div className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="container-content">
          <p className="section-label text-brand-gold mb-3">Browse by goal</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Wellness Goals
          </h1>
          <p className="text-brand-cream/70 text-lg max-w-xl">
            Not sure where to start? Choose a goal and we'll show you the ingredients with the
            best evidence behind them.
          </p>
        </div>
      </div>

      <div className="container-content py-10">
        {/* Disclaimer */}
        <div className="info-box mb-8 max-w-2xl">
          <p className="text-sm">
            We use wellness-support language only. We do not diagnose, treat or cure medical
            conditions.{' '}
            <Link href="/disclaimer" className="underline font-medium hover:text-brand-green">
              Read our disclaimer.
            </Link>
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {goals.map((goal: any) => (
            <GoalCard
              key={goal.id ?? goal.slug}
              name={goal.name}
              slug={goal.slug}
              icon={goal.icon}
              shortDescription={goal.shortDescription}
              ingredientCount={Array.isArray(goal.ingredients) ? goal.ingredients.length : undefined}
            />
          ))}
        </div>
      </div>
    </>
  )
}
