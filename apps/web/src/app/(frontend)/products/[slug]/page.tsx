import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, CheckCircle, XCircle, Leaf, TestTube } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { AffiliateButton } from '@/components/ui/AffiliateButton'
import { SafetyWarningBox } from '@/components/ui/SafetyWarningBox'
import { SponsoredLabel } from '@/components/ui/SponsoredLabel'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'

type Props = { params: Promise<{ slug: string }> }

async function getProduct(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, status: { equals: 'live' } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0] ?? null
}

async function getAffiliateLinks(productId: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'affiliate-links',
    where: { product: { equals: productId }, active: { equals: true } },
    depth: 1,
    limit: 10,
  })
  return result.docs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} — The Herb Pusher`,
    description: product.seo?.description ?? product.shortDescription,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const affiliateLinks = await getAffiliateLinks(String(product.id))

  const imageUrl =
    typeof product.image === 'object' && product.image?.url ? product.image.url : null
  const brandName = typeof product.brand === 'object' ? product.brand?.name : ''

  return (
    <div className="container-content py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link href="/" className="hover:text-brand-green">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/products" className="hover:text-brand-green">Products</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-charcoal font-medium" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square bg-brand-sage rounded-[var(--radius-card)] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-brand-leaf/20">
              <span className="text-8xl" aria-hidden="true">⬡</span>
            </div>
          )}
          {product.sponsored && (
            <div className="absolute top-3 left-3">
              <SponsoredLabel variant="banner" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-brand-leaf text-sm font-medium uppercase tracking-wide mb-1">
              {brandName}
            </p>
            <h1 className="text-2xl font-bold text-brand-charcoal mb-2">{product.name}</h1>
            {product.format && (
              <p className="text-gray-500 text-sm capitalize">{product.format}</p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.vegan === 'yes' && (
              <span className="badge-pill bg-brand-sage text-brand-green border border-brand-leaf/30">
                <Leaf className="size-3" aria-hidden="true" />
                Vegan
              </span>
            )}
            {product.thirdPartyTested === 'yes' && (
              <span className="badge-pill bg-brand-sage text-brand-green border border-brand-leaf/30">
                <TestTube className="size-3" aria-hidden="true" />
                3rd Party Tested
              </span>
            )}
            {product.glutenFree === 'yes' && (
              <span className="badge-pill bg-brand-sage text-brand-charcoal">Gluten-Free</span>
            )}
            {product.sugarFree === 'yes' && (
              <span className="badge-pill bg-brand-sage text-brand-charcoal">Sugar-Free</span>
            )}
          </div>

          {/* Price */}
          <div className="card-base p-4">
            {product.price != null ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-brand-charcoal">
                  £{product.price.toFixed(2)}
                </span>
                {product.pricePerServing != null && (
                  <span className="text-sm text-gray-500">
                    {product.pricePerServing < 100
                      ? `${product.pricePerServing}p/serving`
                      : `£${(product.pricePerServing / 100).toFixed(2)}/serving`}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Price not listed — check retailer.</p>
            )}
          </div>

          {/* Affiliate links */}
          {affiliateLinks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {affiliateLinks.map((link: any) => {
                const retailerName =
                  typeof link.retailer === 'object' ? link.retailer?.name : 'retailer'
                const price = link.price ? `£${link.price.toFixed(2)}` : undefined
                return (
                  <AffiliateButton
                    key={link.id}
                    href={link.url}
                    retailerName={retailerName}
                    price={price}
                  />
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No affiliate links added yet.</p>
          )}

          {/* Dose info */}
          {(product.dosePerServing || product.servingsPerContainer) && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.dosePerServing && (
                <div className="card-base p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Dose</p>
                  <p className="font-semibold">{product.dosePerServing}</p>
                </div>
              )}
              {product.servingsPerContainer && (
                <div className="card-base p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Servings</p>
                  <p className="font-semibold">{product.servingsPerContainer}</p>
                </div>
              )}
            </div>
          )}

          {/* Last reviewed */}
          {product.lastReviewed && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              Last reviewed:{' '}
              {new Date(product.lastReviewed).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      {/* Pros / Cons */}
      {((product.pros && product.pros.length > 0) || (product.cons && product.cons.length > 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
          {product.pros && product.pros.length > 0 && (
            <div>
              <h2 className="font-bold text-brand-charcoal mb-3">Pros</h2>
              <ul className="space-y-2">
                {product.pros.map((p: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="size-4 text-brand-leaf shrink-0 mt-0.5" aria-hidden="true" />
                    {p.pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.cons && product.cons.length > 0 && (
            <div>
              <h2 className="font-bold text-brand-charcoal mb-3">Cons</h2>
              <ul className="space-y-2">
                {product.cons.map((c: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <XCircle className="size-4 text-brand-caution shrink-0 mt-0.5" aria-hidden="true" />
                    {c.con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Who it may suit / cautions */}
      {(product.whoItMaySuit || product.whoShouldBeCautious) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {product.whoItMaySuit && (
            <div className="info-box">
              <h2 className="font-semibold mb-2">Who it may suit</h2>
              <p className="text-sm">{product.whoItMaySuit}</p>
            </div>
          )}
          {product.whoShouldBeCautious && (
            <SafetyWarningBox title="Who should be cautious">
              <p>{product.whoShouldBeCautious}</p>
            </SafetyWarningBox>
          )}
        </div>
      )}

      {/* Active ingredients */}
      {product.activeIngredients && product.activeIngredients.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-brand-charcoal mb-3">Active ingredients</h2>
          <div className="flex flex-wrap gap-2">
            {product.activeIngredients.map((ing: any) => (
              <Link
                key={ing.id ?? ing}
                href={`/ingredients/${ing.slug ?? ing}`}
                className="badge-pill bg-brand-sage text-brand-green border border-brand-leaf/30 hover:bg-brand-leaf hover:text-white transition-colors"
              >
                {ing.name ?? ing}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <SafetyWarningBox severity="info" className="mt-10">
        <p className="text-xs">
          This page contains affiliate links. We may earn a commission if you buy through them —
          this doesn't affect our editorial rating.{' '}
          <Link href="/affiliate-disclosure" className="underline">
            Affiliate disclosure
          </Link>
          . This information is for general purposes only and is not medical advice.
        </p>
      </SafetyWarningBox>
    </div>
  )
}
