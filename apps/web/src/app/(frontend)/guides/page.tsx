import type { Metadata } from 'next'
import type { Where } from 'payload'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Buying Guides & Articles',
  description:
    'Honest supplement buying guides, product comparisons and myth-busting articles. No hype, no miracle claims.',
}

const TYPE_FILTERS = [
  { value: '', label: 'All' },
  { value: 'buying_guide', label: 'Buying Guides' },
  { value: 'comparison', label: 'Comparisons' },
  { value: 'goal_guide', label: 'Goal Guides' },
  { value: 'myth_busting', label: 'Myth Busting' },
  { value: 'explainer', label: 'Explainers' },
]

type Props = { searchParams: Promise<{ type?: string }> }

export default async function GuidesPage({ searchParams }: Props) {
  const { type = '' } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const where: Where = { status: { equals: 'published' } }
  if (type) where['type'] = { equals: type }

  const result = await payload.find({
    collection: 'articles',
    where,
    sort: '-publishedAt',
    limit: 50,
    depth: 0,
  })

  return (
    <>
      {/* Hero */}
      <div className="bg-brand-charcoal text-brand-cream py-12 md:py-16">
        <div className="container-content">
          <p className="section-label text-brand-gold mb-3">Expert guidance</p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Guides &amp; Articles
          </h1>
          <p className="text-brand-cream/70 text-lg max-w-xl">
            Honest buying guides, comparisons and no-BS explainers. Updated regularly by our
            editorial team.
          </p>
        </div>
      </div>

      <div className="container-content py-8">
        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2 mb-8" role="list" aria-label="Filter by type">
          {TYPE_FILTERS.map(({ value, label }) => {
            const isActive = type === value
            return (
              <Link
                key={value}
                href={value ? `/guides?type=${value}` : '/guides'}
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

        {result.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.docs.map((article: any) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                type={article.type}
                publishedAt={article.publishedAt}
                author={article.author}
                sponsored={article.sponsored}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="size-12 mx-auto mb-4 text-brand-sage" aria-hidden="true" />
            <p className="font-heading font-bold text-lg text-gray-500 mb-1">
              Guides coming soon.
            </p>
            <p className="text-sm">
              We&apos;re working on buying guides for the most popular supplements.
              {type && (
                <>
                  {' '}
                  <Link href="/guides" className="text-brand-green hover:underline">
                    Clear filter
                  </Link>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
