import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { ArticleCard } from '@/components/ui/ArticleCard'

export const metadata: Metadata = {
  title: 'Buying Guides & Articles — The Herb Pusher',
  description:
    'Honest supplement buying guides, product comparisons and myth-busting articles.',
}

export default async function GuidesPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 0,
  })

  return (
    <div className="container-content py-8">
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-2">Guides & Articles</h1>
        <p className="text-gray-600">
          Buying guides, comparisons and no-BS explainers — updated regularly.
        </p>
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
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4" aria-hidden="true">📖</p>
          <p className="font-semibold">Guides coming soon.</p>
          <p className="text-sm mt-1">We're working on buying guides for the most popular supplements.</p>
        </div>
      )}
    </div>
  )
}
