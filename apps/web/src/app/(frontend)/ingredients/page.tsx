import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { Leaf } from 'lucide-react'

export const dynamic = 'force-dynamic'
import type { EvidenceRating } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Ingredient Database',
  description:
    'Browse our complete ingredient database — vitamins, minerals, herbs and supplements with evidence ratings, safety notes and buying guides.',
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'vitamin', label: 'Vitamins' },
  { value: 'mineral', label: 'Minerals' },
  { value: 'herb', label: 'Herbs' },
  { value: 'amino_acid', label: 'Amino Acids' },
  { value: 'fatty_acid', label: 'Fatty Acids' },
  { value: 'mushroom', label: 'Mushrooms' },
  { value: 'probiotic', label: 'Probiotics' },
  { value: 'other', label: 'Other' },
]

type Props = { searchParams: Promise<{ category?: string }> }

export default async function IngredientsPage({ searchParams }: Props) {
  const { category = '' } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const where: Record<string, unknown> = { status: { equals: 'published' } }
  if (category) where.category = { equals: category }

  const result = await payload.find({
    collection: 'ingredients',
    where,
    sort: 'name',
    limit: 200,
    depth: 0,
  })

  const ingredients = result.docs

  return (
    <>
      {/* Page hero */}
      <div className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="container-content">
          <p className="section-label text-brand-gold mb-3">The database</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Ingredient Database
          </h1>
          <p className="text-brand-cream/70 text-lg max-w-xl mb-6">
            Every vitamin, mineral, herb and supplement — evidence ratings, safety notes and buying
            guides included. No hype.
          </p>
          <SearchBar
            size="default"
            placeholder="Search ingredients…"
            className="max-w-lg"
          />
        </div>
      </div>

      <div className="container-content py-8">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="Filter by category">
          {CATEGORIES.map(({ value, label }) => {
            const isActive = category === value
            return (
              <Link
                key={value}
                href={value ? `/ingredients?category=${value}` : '/ingredients'}
                className={
                  isActive
                    ? 'badge-pill bg-brand-green text-brand-cream'
                    : 'badge-pill bg-brand-offwhite text-brand-charcoal border border-brand-sage hover:border-brand-leaf transition-colors'
                }
                aria-current={isActive ? 'true' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Count + evidence key */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <p className="text-sm text-gray-500">
            {result.totalDocs === 0
              ? 'No ingredients found'
              : `${result.totalDocs} ingredient${result.totalDocs !== 1 ? 's' : ''}${category ? ` in ${CATEGORIES.find((c) => c.value === category)?.label ?? category}` : ''}`}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {(['strong', 'moderate', 'early'] as EvidenceRating[]).map((r) => (
              <EvidenceBadge key={r} rating={r} size="sm" />
            ))}
          </div>
        </div>

        {/* Grid */}
        {ingredients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map((ing: any) => (
              <IngredientCard
                key={ing.id}
                name={ing.name}
                slug={ing.slug}
                shortSummary={ing.shortSummary}
                evidenceRating={(ing.evidenceRating ?? 'moderate') as EvidenceRating}
                category={ing.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Leaf className="size-12 mx-auto mb-4 text-brand-sage" aria-hidden="true" />
            <p className="font-heading font-bold text-lg text-gray-500 mb-1">
              No herbs found hiding in the cupboard.
            </p>
            <p className="text-sm">
              <Link href="/ingredients" className="text-brand-green hover:underline">
                Clear filters
              </Link>{' '}
              or check back soon — we're adding new profiles regularly.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
