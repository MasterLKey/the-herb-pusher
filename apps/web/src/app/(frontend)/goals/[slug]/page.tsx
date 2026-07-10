import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { ProductCard } from '@/components/product/ProductCard'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { SafetyWarningBox } from '@/components/ui/SafetyWarningBox'
import type { EvidenceRating } from '@/lib/utils'

export const dynamic = 'force-dynamic'

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
    title: `${goal.name} Support — Ingredients & Evidence`,
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
    <>
      {/* Hero */}
      <div className="bg-brand-green text-brand-cream py-12 md:py-16">
        <div className="container-content">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-brand-cream/50 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-cream transition-colors">Home</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href="/goals" className="hover:text-brand-cream transition-colors">Goals</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="text-brand-cream/80" aria-current="page">{goal.name}</span>
          </nav>

          <p className="section-label text-brand-gold mb-3">Wellness goal</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{goal.name}</h1>
          <p className="text-brand-cream/80 text-lg max-w-xl leading-relaxed">{goal.shortDescription}</p>
        </div>
      </div>

      <div className="container-content py-10 max-w-5xl">

        {/* Overview text */}
        {goal.description && (
          <section className="mb-8" aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
              Overview
            </h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl">{goal.description}</p>
          </section>
        )}

        {/* Medical disclaimer */}
        <SafetyWarningBox severity="info" className="mb-10">
          The information on this page is for general wellness education only. We do not make medical
          claims or diagnose conditions. Always speak to a GP or pharmacist before starting supplements,
          especially if you take medication or have a health condition.
        </SafetyWarningBox>

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <section aria-labelledby="ingredients-heading" className="mb-12">
            <div className="flex items-end justify-between mb-6 gap-4">
              <div>
                <p className="section-label mb-2">Evidence-rated</p>
                <h2 id="ingredients-heading" className="text-3xl font-heading font-bold text-brand-charcoal">
                  Relevant ingredients
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((ing: any) => (
                <IngredientCard
                  key={ing.id ?? ing}
                  name={ing.name ?? ing}
                  slug={ing.slug ?? ing}
                  shortSummary={ing.shortSummary ?? ''}
                  evidenceRating={(ing.evidenceRating ?? 'moderate') as EvidenceRating}
                  category={ing.category}
                />
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        {products.length > 0 && (
          <section aria-labelledby="products-heading" className="mb-12">
            <div className="mb-6">
              <p className="section-label mb-2">Recommended</p>
              <h2 id="products-heading" className="text-3xl font-heading font-bold text-brand-charcoal">
                Products we like
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p: any) => (
                <ProductCard
                  key={p.id ?? p}
                  name={p.name ?? p}
                  slug={p.slug ?? p}
                  brandName={typeof p.brand === 'object' ? p.brand?.name ?? '' : ''}
                  format={p.format}
                  price={p.price}
                  vegan={p.vegan}
                  thirdPartyTested={p.thirdPartyTested}
                />
              ))}
            </div>
          </section>
        )}

        {/* Related guides */}
        {guides.length > 0 && (
          <section aria-labelledby="guides-heading" className="mb-12">
            <div className="mb-6">
              <p className="section-label mb-2">Further reading</p>
              <h2 id="guides-heading" className="text-3xl font-heading font-bold text-brand-charcoal">
                Related guides
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((article: any) => (
                <ArticleCard
                  key={article.id ?? article}
                  title={article.title ?? article}
                  slug={article.slug ?? article}
                  excerpt={article.excerpt ?? ''}
                  type={article.type ?? 'goal_guide'}
                />
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="pt-6 border-t border-brand-sage">
          <Link href="/goals" className="btn-secondary inline-flex items-center gap-2">
            <ChevronRight className="size-4 rotate-180" aria-hidden="true" />
            All wellness goals
          </Link>
        </div>
      </div>
    </>
  )
}
