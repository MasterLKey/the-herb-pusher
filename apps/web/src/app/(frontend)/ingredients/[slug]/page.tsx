import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ExternalLink } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { SafetyWarningBox } from '@/components/ui/SafetyWarningBox'
import { AffiliateButton } from '@/components/ui/AffiliateButton'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { ProductCard } from '@/components/product/ProductCard'
import { EVIDENCE_RATING_CONFIG, type EvidenceRating } from '@/lib/utils'

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
    where: {
      activeIngredients: { contains: ingredientId },
      status: { equals: 'live' },
    },
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
    title: `${ing.name} — The Herb Pusher`,
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

  const rating = ing.evidenceRating as EvidenceRating
  const ratingConfig = EVIDENCE_RATING_CONFIG[rating]

  return (
    <div className="container-content py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-brand-green">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/ingredients" className="hover:text-brand-green">Ingredients</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-charcoal font-medium" aria-current="page">{ing.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        {ing.category && (
          <p className="text-brand-leaf text-sm font-medium uppercase tracking-wide mb-2">{ing.category}</p>
        )}
        <h1 className="text-4xl font-bold text-brand-charcoal mb-4">{ing.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <EvidenceBadge rating={rating} size="lg" />
          {ing.lastReviewed && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="size-3" aria-hidden="true" />
              Last reviewed:{' '}
              {new Date(ing.lastReviewed).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{ing.shortSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-xl font-bold text-brand-charcoal mb-3">Overview</h2>
            <p className="text-gray-700 leading-relaxed">{ing.overview}</p>
          </section>

          {/* Evidence */}
          <section aria-labelledby="evidence-heading" className="card-base p-5">
            <h2 id="evidence-heading" className="text-xl font-bold text-brand-charcoal mb-3">
              Evidence rating
            </h2>
            <div className="flex items-start gap-3">
              <EvidenceBadge rating={rating} size="md" />
              <p className="text-sm text-gray-600 leading-relaxed">
                {ing.evidenceSummary ?? ratingConfig.description}
              </p>
            </div>
          </section>

          {/* Common uses */}
          {ing.commonUses && ing.commonUses.length > 0 && (
            <section aria-labelledby="uses-heading">
              <h2 id="uses-heading" className="text-xl font-bold text-brand-charcoal mb-3">Common uses</h2>
              <ul className="space-y-2">
                {ing.commonUses.map((u: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    {u.evidenceLevel && (
                      <EvidenceBadge rating={u.evidenceLevel} size="sm" className="shrink-0 mt-0.5" />
                    )}
                    <span className="text-gray-700 text-sm">{u.use}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Cautions */}
          {ing.cautions && ing.cautions.length > 0 && (
            <section aria-labelledby="cautions-heading">
              <h2 id="cautions-heading" className="text-xl font-bold text-brand-charcoal mb-3">
                Safety & cautions
              </h2>
              <div className="space-y-3">
                {ing.cautions.map((c: any, i: number) => (
                  <SafetyWarningBox key={i} severity={c.severity ?? 'caution'}>
                    {c.caution}
                  </SafetyWarningBox>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Worth checking with a pharmacist if you take medication.
              </p>
            </section>
          )}

          {/* Common forms */}
          {ing.commonForms && ing.commonForms.length > 0 && (
            <section aria-labelledby="forms-heading">
              <h2 id="forms-heading" className="text-xl font-bold text-brand-charcoal mb-3">
                Common forms
              </h2>
              <div className="space-y-3">
                {ing.commonForms.map((f: any, i: number) => (
                  <div key={i} className="card-base p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-brand-charcoal">{f.form}</span>
                      {f.recommended && (
                        <span className="badge-pill bg-brand-green text-brand-cream text-xs">
                          Recommended
                        </span>
                      )}
                    </div>
                    {f.notes && <p className="text-sm text-gray-600">{f.notes}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Food sources */}
          {ing.foodSources && ing.foodSources.length > 0 && (
            <section aria-labelledby="food-heading">
              <h2 id="food-heading" className="text-xl font-bold text-brand-charcoal mb-3">
                Food sources
              </h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ing.foodSources.map((f: any, i: number) => (
                  <li key={i} className="card-base px-3 py-2 text-sm">
                    <span className="font-medium text-brand-charcoal">{f.source}</span>
                    {f.notes && <span className="text-gray-500 text-xs block">{f.notes}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sources */}
          {ing.sources && ing.sources.length > 0 && (
            <section aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="text-xl font-bold text-brand-charcoal mb-3">
                References
              </h2>
              <ol className="space-y-2">
                {ing.sources.map((s: any, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-brand-leaf font-mono shrink-0">[{i + 1}]</span>
                    <span>
                      {s.title}
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-brand-green hover:underline inline-flex items-center gap-0.5"
                        >
                          <ExternalLink className="size-3" />
                          Link
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
        <aside className="space-y-6">
          {/* Approved claims */}
          {ing.approvedClaims && ing.approvedClaims.length > 0 && (
            <div className="info-box">
              <p className="font-semibold text-sm mb-2">Authorised health claims</p>
              <ul className="space-y-1">
                {ing.approvedClaims.map((c: any, i: number) => (
                  <li key={i} className="text-xs text-gray-700">• {c.claim}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Related products */}
          {products.length > 0 && (
            <div>
              <h2 className="font-bold text-brand-charcoal mb-3">Recommended products</h2>
              <div className="space-y-4">
                {products.map((p: any) => (
                  <div key={p.id} className="card-base p-4 flex flex-col gap-3">
                    <div>
                      <p className="text-xs text-brand-leaf font-medium">
                        {typeof p.brand === 'object' ? p.brand?.name : ''}
                      </p>
                      <Link
                        href={`/products/${p.slug}`}
                        className="font-semibold text-sm text-brand-charcoal hover:text-brand-green"
                      >
                        {p.name}
                      </Link>
                      {p.price && (
                        <p className="text-sm font-bold mt-0.5">£{p.price.toFixed(2)}</p>
                      )}
                    </div>
                    <Link href={`/products/${p.slug}`} className="btn-secondary text-xs text-center">
                      View product
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related ingredients */}
          {ing.relatedIngredients && ing.relatedIngredients.length > 0 && (
            <div>
              <h2 className="font-bold text-brand-charcoal mb-3">Related ingredients</h2>
              <div className="space-y-2">
                {ing.relatedIngredients.map((r: any) => (
                  <Link
                    key={r.id ?? r}
                    href={`/ingredients/${r.slug ?? r}`}
                    className="block card-base px-4 py-3 text-sm font-medium text-brand-charcoal hover:text-brand-green hover:border-brand-leaf transition-all"
                  >
                    {r.name ?? r}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Medical disclaimer */}
          <SafetyWarningBox severity="info">
            <p className="text-xs">
              This information is for educational purposes only. Always consult a qualified
              healthcare professional before starting any supplement, especially if you are
              pregnant, breastfeeding, taking medication or managing a health condition.
            </p>
          </SafetyWarningBox>
        </aside>
      </div>
    </div>
  )
}
