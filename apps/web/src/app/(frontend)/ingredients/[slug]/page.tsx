import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ExternalLink, ChevronRight, AlertTriangle } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { SafetyWarningBox } from '@/components/ui/SafetyWarningBox'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { EVIDENCE_RATING_CONFIG, type EvidenceRating } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

async function getIngredient(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'ingredients',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}

async function getRelatedProducts(ingredientId: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: { activeIngredients: { contains: ingredientId }, status: { equals: 'live' } },
    depth: 2,
    limit: 4,
  })
  return result.docs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ing = await getIngredient(slug)
  if (!ing) return {}
  return {
    title: `${ing.name} — Evidence, Benefits & Buying Guide`,
    description: ing.seo?.description ?? ing.shortSummary,
  }
}

export default async function IngredientPage({ params }: Props) {
  const { slug } = await params
  const [ing, products] = await Promise.all([
    getIngredient(slug),
    getIngredient(slug).then((i) => (i ? getRelatedProducts(String(i.id)) : [])),
  ])

  if (!ing) notFound()

  const rating = (ing.evidenceRating ?? 'moderate') as EvidenceRating
  const ratingConfig = EVIDENCE_RATING_CONFIG[rating]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: ing.name,
    description: ing.shortSummary,
    dateModified: ing.lastReviewed ?? ing.updatedAt,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-brand-charcoal text-brand-cream py-10 md:py-14">
        <div className="container-content">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-brand-cream/50 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-cream transition-colors">Home</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href="/ingredients" className="hover:text-brand-cream transition-colors">Ingredients</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="text-brand-cream/80" aria-current="page">{ing.name}</span>
          </nav>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              {ing.category && (
                <p className="section-label text-brand-gold mb-2">{ing.category}</p>
              )}
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{ing.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <EvidenceBadge rating={rating} size="lg" />
                {ing.lastReviewed && (
                  <span className="flex items-center gap-1 text-xs text-brand-cream/50">
                    <Clock className="size-3" aria-hidden="true" />
                    Last reviewed{' '}
                    {new Date(ing.lastReviewed).toLocaleDateString('en-GB', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
              <p className="text-brand-cream/80 text-lg leading-relaxed max-w-2xl">{ing.shortSummary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-content py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Overview */}
            {ing.overview && (
              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
                  Overview
                </h2>
                <p className="text-gray-700 leading-relaxed">{ing.overview}</p>
              </section>
            )}

            {/* Evidence panel */}
            <section
              aria-labelledby="evidence-heading"
              className="rounded-[var(--radius-card)] border-l-4 border-l-brand-green bg-brand-offwhite border border-brand-sage p-6"
            >
              <h2 id="evidence-heading" className="text-xl font-heading font-bold text-brand-charcoal mb-3">
                Evidence rating
              </h2>
              <div className="flex items-start gap-4">
                <EvidenceBadge rating={rating} size="lg" />
                <p className="text-gray-600 leading-relaxed">
                  {ing.evidenceSummary ?? ratingConfig.description}
                </p>
              </div>
            </section>

            {/* Common uses */}
            {ing.commonUses && ing.commonUses.length > 0 && (
              <section aria-labelledby="uses-heading">
                <h2 id="uses-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
                  Common uses
                </h2>
                <ul className="space-y-3">
                  {ing.commonUses.map((u: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-brand-offwhite rounded-lg border border-brand-sage">
                      {u.evidenceLevel && (
                        <EvidenceBadge rating={u.evidenceLevel} size="sm" className="shrink-0 mt-0.5" />
                      )}
                      <span className="text-gray-700 text-sm leading-relaxed">{u.use}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Cautions */}
            {ing.cautions && ing.cautions.length > 0 && (
              <section aria-labelledby="cautions-heading">
                <h2 id="cautions-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
                  Safety &amp; cautions
                </h2>
                <div className="space-y-3">
                  {ing.cautions.map((c: any, i: number) => (
                    <SafetyWarningBox key={i} severity={c.severity ?? 'caution'}>
                      {c.caution}
                    </SafetyWarningBox>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                  <AlertTriangle className="size-3" aria-hidden="true" />
                  Worth checking with a pharmacist if you take medication.
                </p>
              </section>
            )}

            {/* Common forms */}
            {ing.commonForms && ing.commonForms.length > 0 && (
              <section aria-labelledby="forms-heading">
                <h2 id="forms-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
                  Common forms
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ing.commonForms.map((f: any, i: number) => (
                    <div key={i} className="card-base p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-semibold text-brand-charcoal">{f.form}</span>
                        {f.recommended && (
                          <span className="badge-pill bg-brand-green text-brand-cream text-xs">
                            Best form
                          </span>
                        )}
                      </div>
                      {f.notes && <p className="text-sm text-gray-500 leading-relaxed">{f.notes}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Food sources */}
            {ing.foodSources && ing.foodSources.length > 0 && (
              <section aria-labelledby="food-heading">
                <h2 id="food-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
                  Food sources
                </h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ing.foodSources.map((f: any, i: number) => (
                    <li key={i} className="card-base px-3 py-2.5 text-sm">
                      <span className="font-semibold text-brand-charcoal">{f.source}</span>
                      {f.notes && <span className="text-gray-400 text-xs block mt-0.5">{f.notes}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* References */}
            {ing.sources && ing.sources.length > 0 && (
              <section aria-labelledby="sources-heading">
                <h2 id="sources-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
                  References
                </h2>
                <ol className="space-y-2.5">
                  {ing.sources.map((s: any, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-3">
                      <span className="text-brand-leaf font-mono shrink-0 font-bold">[{i + 1}]</span>
                      <span>
                        {s.title}
                        {s.url && (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-brand-green hover:underline inline-flex items-center gap-0.5"
                          >
                            <ExternalLink className="size-3" aria-hidden="true" />
                            View source
                          </a>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">

            {/* Authorised health claims */}
            {ing.approvedClaims && ing.approvedClaims.length > 0 && (
              <div className="info-box">
                <p className="font-heading font-bold text-sm text-brand-charcoal mb-2">
                  Authorised health claims
                </p>
                <ul className="space-y-1.5">
                  {ing.approvedClaims.map((c: any, i: number) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                      <span className="text-brand-leaf shrink-0">•</span>
                      {c.claim}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended products */}
            {products.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-brand-charcoal mb-3 text-lg">
                  Recommended products
                </h2>
                <div className="space-y-3">
                  {products.map((p: any) => (
                    <div key={p.id} className="card-base p-4">
                      <p className="section-label mb-1">
                        {typeof p.brand === 'object' ? p.brand?.name : ''}
                      </p>
                      <Link
                        href={`/products/${p.slug}`}
                        className="font-heading font-semibold text-brand-charcoal hover:text-brand-green transition-colors block leading-snug"
                      >
                        {p.name}
                      </Link>
                      {p.price && (
                        <p className="font-bold text-brand-charcoal mt-1">£{p.price.toFixed(2)}</p>
                      )}
                      <Link href={`/products/${p.slug}`} className="btn-primary text-xs mt-3 block text-center">
                        Check price
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related ingredients */}
            {ing.relatedIngredients && ing.relatedIngredients.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-brand-charcoal mb-3 text-lg">
                  Related ingredients
                </h2>
                <div className="space-y-2">
                  {ing.relatedIngredients.map((r: any) => (
                    <Link
                      key={r.id ?? r}
                      href={`/ingredients/${r.slug ?? r}`}
                      className="flex items-center justify-between card-base px-4 py-3 text-sm font-medium text-brand-charcoal hover:text-brand-green hover:border-brand-leaf transition-all group"
                    >
                      <span>{r.name ?? r}</span>
                      <ChevronRight className="size-4 text-gray-300 group-hover:text-brand-green transition-colors" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Medical disclaimer */}
            <SafetyWarningBox severity="info">
              <p className="text-xs leading-relaxed">
                This information is for educational purposes only. Always consult a qualified
                healthcare professional before starting any supplement, especially if you are
                pregnant, breastfeeding, taking medication or managing a health condition.
              </p>
            </SafetyWarningBox>
          </aside>
        </div>
      </div>
    </>
  )
}
