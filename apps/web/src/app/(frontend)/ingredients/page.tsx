import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { SearchBar } from '@/components/ui/SearchBar'
import type { EvidenceRating } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Ingredient Database — The Herb Pusher',
  description:
    'Browse our complete ingredient database — vitamins, minerals, herbs and supplements with evidence ratings, safety notes and buying guides.',
}

export default async function IngredientsPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'ingredients',
    where: { status: { equals: 'published' } },
    sort: 'name',
    limit: 100,
    depth: 0,
  })

  const ingredients = result.docs

  return (
    <div className="container-content py-8">
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-2">Ingredient Database</h1>
        <p className="text-gray-600 mb-4">
          {result.totalDocs} ingredient{result.totalDocs !== 1 ? 's' : ''} — evidence ratings,
          safety notes and buying guides included.
        </p>
        <SearchBar placeholder="Search ingredients…" />
      </div>

      {ingredients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((ing: any) => (
            <IngredientCard
              key={ing.id}
              name={ing.name}
              slug={ing.slug}
              shortSummary={ing.shortSummary}
              evidenceRating={ing.evidenceRating as EvidenceRating}
              category={ing.category}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4" aria-hidden="true">⬡</p>
          <p className="font-semibold">No ingredients published yet.</p>
          <p className="text-sm mt-1">Check back soon — we're adding new profiles regularly.</p>
        </div>
      )}
    </div>
  )
}
