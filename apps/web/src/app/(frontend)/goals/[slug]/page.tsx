import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { ProductCard } from '@/components/product/ProductCard'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { SafetyWarningBox } from '@/components/ui/SafetyWarningBox'
import type { EvidenceRating } from '@/lib/utils'

type Props = { params: Promise<{ slug: string }> }

async function getGoal(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'wellness-goals',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const goal = await getGoal(slug)
  if (!goal) return {}
  return {
    title: `${goal.name} Support — The Herb Pusher`,
    description: goal.seo?.description ?? goal.shortDescription,
  }
}

export default async function GoalPage({ params }: Props) {
  const { slug } = await params
  const goal = await getGoal(slug)
  if (!goal) notFound()

  const ingredients = Array.isArray(goal.ingredients) ? goal.ingredients : []
  const products = Array.isArray(goal.featuredProducts) ? goal.featuredProducts : []
  const guides = Array.isArray(goal.relatedGuides) ? goal.relatedGuides : []

  return (
    <div className="container-content py-8 max-w-4xl">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-brand-green">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/goals" className="hover:text-brand-green">Goals</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-charcoal font-medium" aria-current="page">{goal.name}</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-brand-charcoal mb-2">{goal.name}</h1>
      <p className="text-gray-600 text-lg mb-4">{goal.shortDescription}</p>
      {goal.description && (
        <p className="text-gray-700 leading-relaxed mb-8">{goal.description}</p>
      )}

      <SafetyWarningBox severity="info" className="mb-8">
        The information on this page is for general wellness education only. We do not make medical
        claims. Always speak to a GP or pharmacist before starting supplements, especially if you
        take medication or have a health condition.
      </SafetyWarningBox>

      {ingredients.length > 0 && (
        <section aria-labelledby="ingredients-heading" className="mb-10">
          <h2 id="ingredients-heading" className="text-xl font-bold text-brand-charcoal mb-4">
            Relevant ingredients
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ingredients.map((ing: any) => (
              <IngredientCard
                key={ing.id ?? ing}
                name={ing.name ?? ing}
                slug={ing.slug ?? ing}
                shortSummary={ing.shortSummary ?? ''}
                evidenceRating={(ing.evidenceRating ?? 'early') as EvidenceRating}
                category={ing.category}
              />
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section aria-labelledby="products-heading" className="mb-10">
          <h2 id="products-heading" className="text-xl font-bold text-brand-charcoal mb-4">
            Product suggestions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <ProductCard
                key={p.id ?? p}
                name={p.name ?? p}
                slug={p.slug ?? p}
                brandName={typeof p.brand === 'object' ? p.brand?.name : ''}
                format={p.format}
                price={p.price}
                pricePerServing={p.pricePerServing}
                vegan={p.vegan === 'yes'}
                thirdPartyTested={p.thirdPartyTested === 'yes'}
                sponsored={p.sponsored}
              />
            ))}
          </div>
        </section>
      )}

      {goal.lifestyleNotes && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-brand-charcoal mb-3">Lifestyle notes</h2>
          <p className="text-gray-700 leading-relaxed">{goal.lifestyleNotes}</p>
        </section>
      )}

      {guides.length > 0 && (
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-xl font-bold text-brand-charcoal mb-4">
            Related guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((g: any) => (
              <ArticleCard
                key={g.id ?? g}
                title={g.title ?? g}
                slug={g.slug ?? g}
                excerpt={g.excerpt ?? ''}
                type={g.type ?? 'guide'}
                publishedAt={g.publishedAt}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
