import type { Metadata } from 'next'
import type { Where } from 'payload'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductCard } from '@/components/product/ProductCard'
import { ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Browse evidence-backed supplement products. Price-per-serving comparisons, quality badges, and honest affiliate links.',
}

const FORMAT_FILTERS = [
  { value: '', label: 'All formats' },
  { value: 'capsule', label: 'Capsules' },
  { value: 'tablet', label: 'Tablets' },
  { value: 'powder', label: 'Powder' },
  { value: 'gummy', label: 'Gummies' },
  { value: 'liquid', label: 'Liquid' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name A–Z' },
  { value: '-createdAt', label: 'Recently added' },
  { value: 'price', label: 'Price: low–high' },
]

type Props = { searchParams: Promise<{ format?: string; sort?: string }> }

export default async function ProductsPage({ searchParams }: Props) {
  const { format = '', sort = 'name' } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const where: Where = { status: { equals: 'live' } }
  if (format) where['format'] = { equals: format }

  const result = await payload.find({
    collection: 'products',
    where,
    sort,
    limit: 60,
    depth: 1,
  })

  return (
    <>
      {/* Hero */}
      <div className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="container-content">
          <p className="section-label text-brand-gold mb-3">The marketplace</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Products</h1>
          <p className="text-brand-cream/70 text-lg max-w-xl">
            Curated supplements with honest reviews, price-per-serving breakdowns and quality
            badges. Affiliate links clearly labelled.
          </p>
        </div>
      </div>

      <div className="container-content py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Format pills */}
          <div className="flex flex-wrap gap-2" role="list" aria-label="Filter by format">
            {FORMAT_FILTERS.map(({ value, label }) => {
              const isActive = format === value
              return (
                <Link
                  key={value}
                  href={`/products${new URLSearchParams({ ...(value ? { format: value } : {}), ...(sort !== 'name' ? { sort } : {}) }).toString() ? '?' + new URLSearchParams({ ...(value ? { format: value } : {}), ...(sort !== 'name' ? { sort } : {}) }).toString() : ''}`}
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

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="sort-select" className="text-xs text-gray-500 font-medium whitespace-nowrap">
              Sort:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                className="appearance-none text-sm bg-brand-offwhite border border-brand-sage rounded-lg px-3 py-1.5 pr-7 text-brand-charcoal focus:outline-none focus:border-brand-green cursor-pointer"
                defaultValue={sort}
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6">
          {result.totalDocs === 0
            ? 'No products found'
            : `${result.totalDocs} product${result.totalDocs !== 1 ? 's' : ''}`}
        </p>

        {/* Affiliate disclosure */}
        <div className="info-box mb-8 text-xs">
          <span className="font-semibold">Transparency:</span> Some product links are affiliate links
          — we may earn a small commission at no cost to you.{' '}
          <Link href="/affiliate-disclosure" className="underline hover:text-brand-green font-medium">
            How we make money.
          </Link>
          {' '}Sponsored products are clearly labelled. Evidence ratings are never influenced by
          commercial relationships.
        </div>

        {/* Grid */}
        {result.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {result.docs.map((product: any) => (
              <ProductCard
                key={product.id}
                name={product.name}
                slug={product.slug}
                brandName={typeof product.brand === 'object' ? product.brand?.name ?? '' : ''}
                format={product.format}
                price={product.price}
                pricePerServing={product.pricePerServing}
                vegan={product.vegan}
                thirdPartyTested={product.thirdPartyTested}
                sponsored={product.sponsored}
                imageUrl={typeof product.image === 'object' ? product.image?.url : undefined}
                imageAlt={typeof product.image === 'object' ? product.image?.alt : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag className="size-12 mx-auto mb-4 text-brand-sage" aria-hidden="true" />
            <p className="font-heading font-bold text-lg text-gray-500 mb-1">No products yet.</p>
            <p className="text-sm">
              We&apos;re reviewing products to add to the database.{' '}
              {format && (
                <Link href="/products" className="text-brand-green hover:underline">
                  Clear filter
                </Link>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
