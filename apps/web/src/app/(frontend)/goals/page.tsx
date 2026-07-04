import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { GoalCard } from '@/components/ui/GoalCard'

export const metadata: Metadata = {
  title: 'Wellness Goals — The Herb Pusher',
  description:
    'Browse supplements by wellness goal — sleep, energy, immune support, gut health and more.',
}

export default async function GoalsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'wellness-goals',
    limit: 50,
    depth: 1,
  })

  return (
    <div className="container-content py-8">
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-2">Wellness Goals</h1>
        <p className="text-gray-600">
          Not sure where to start? Browse by what you're trying to support.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          We use wellness-support language only. We do not make medical claims.{' '}
          <a href="/disclaimer" className="underline hover:text-brand-green">Read our disclaimer.</a>
        </p>
      </div>

      {result.docs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {result.docs.map((goal: any) => (
            <GoalCard
              key={goal.id}
              name={goal.name}
              slug={goal.slug}
              icon={goal.icon}
              shortDescription={goal.shortDescription}
              ingredientCount={Array.isArray(goal.ingredients) ? goal.ingredients.length : 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4" aria-hidden="true">🌿</p>
          <p className="font-semibold">Goal pages coming soon.</p>
        </div>
      )}
    </div>
  )
}
