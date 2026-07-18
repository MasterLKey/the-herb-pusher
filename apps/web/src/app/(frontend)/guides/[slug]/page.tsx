import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ChevronRight, ExternalLink } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SafetyWarningBox } from '@/components/ui/SafetyWarningBox'
import { ProductCard } from '@/components/product/ProductCard'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import type { EvidenceRating } from '@/lib/utils'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theherbpusher.com'

type Props = { params: Promise<{ slug: string }> }

const TYPE_LABELS: Record<string, string> = {
  buying_guide: 'Buying Guide',
  comparison: 'Comparison',
  goal_guide: 'Goal Guide',
  myth_busting: 'Myth Busting',
  explainer: 'Explainer',
  news: 'Research',
}

async function getArticle(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}

  const title = article.seo?.title ?? article.title
  const description = article.seo?.description ?? article.excerpt ?? undefined
  const canonicalUrl = `${SITE_URL}/guides/${slug}`

  const ogImageUrl: string | null =
    typeof article.seo?.ogImage === 'object' && article.seo.ogImage?.url
      ? article.seo.ogImage.url.startsWith('http')
        ? article.seo.ogImage.url
        : `${SITE_URL}${article.seo.ogImage.url}`
      : null

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
      ...(article.author ? { authors: [article.author] } : {}),
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | The Herb Pusher`,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const featuredIngredients = Array.isArray(article.featuredIngredients) ? article.featuredIngredients : []
  const featuredProducts = Array.isArray(article.featuredProducts) ? article.featuredProducts : []
  const typeLabel = TYPE_LABELS[article.type] ?? article.type

  const canonicalUrl = `${SITE_URL}/guides/${article.slug}`

  const publisher = {
    '@type': 'Organization',
    name: 'The Herb Pusher',
    url: SITE_URL,
  }

  // Article schema — richer than the basic version
  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': article.type === 'buying_guide' || article.type === 'comparison' ? 'Review' : 'Article',
    headline: article.title,
    description: article.seo?.description ?? article.excerpt ?? undefined,
    url: canonicalUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : publisher,
    publisher,
  }

  // For buying guides with featured products, add an ItemList so search engines
  // surface each recommended product directly in results.
  const itemListSchema =
    featuredProducts.length > 0 &&
    (article.type === 'buying_guide' || article.type === 'comparison')
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: article.title,
          url: canonicalUrl,
          itemListElement: featuredProducts.map((p: any, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/products/${p.slug ?? p}`,
            name: p.name ?? p,
          })),
        }
      : null

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl },
    ],
  }

  const jsonLd = [articleSchema, ...(itemListSchema ? [itemListSchema] : []), breadcrumbLd]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-brand-charcoal text-brand-cream py-10 md:py-14">
        <div className="container-content max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-brand-cream/50 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-cream transition-colors">Home</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <Link href="/guides" className="hover:text-brand-cream transition-colors">Guides</Link>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="text-brand-cream/80 line-clamp-1" aria-current="page">{article.title}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="badge-pill bg-brand-green text-brand-cream">{typeLabel}</span>
            {article.sponsored && (
              <span className="badge-pill bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                Sponsored
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-brand-cream/70 text-lg leading-relaxed max-w-2xl mb-4">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-cream/50">
            {article.author && <span>By {article.author}</span>}
            {article.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" aria-hidden="true" />
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container-content py-10 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main article content */}
          <div className="lg:col-span-2">

            {/* Affiliate disclosure for sponsored content */}
            {article.sponsored && (
              <SafetyWarningBox severity="info" className="mb-6">
                <span className="font-semibold">Sponsored content.</span>{' '}
                This article contains sponsored placements. Our editorial standards and evidence
                ratings are not affected by commercial relationships.{' '}
                <Link href="/affiliate-disclosure" className="underline hover:text-brand-green">
                  Read our disclosure.
                </Link>
              </SafetyWarningBox>
            )}

            {/* Article body — rendered from Payload Lexical JSON */}
            {article.content ? (
              <RichText
                className="prose-brand"
                data={article.content as Parameters<typeof RichText>[0]['data']}
              />
            ) : (
              <p className="text-gray-500">Content coming soon.</p>
            )}

            {/* Featured ingredients */}
            {featuredIngredients.length > 0 && (
              <section aria-labelledby="ing-heading" className="mt-12">
                <h2 id="ing-heading" className="text-2xl font-heading font-bold text-brand-charcoal mb-4">
                  Ingredients covered in this guide
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredIngredients.map((ing: any) => (
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

            {/* Sources */}
            {Array.isArray(article.sources) && article.sources.length > 0 && (
              <section aria-labelledby="sources-heading" className="mt-12 pt-8 border-t border-brand-sage">
                <h2 id="sources-heading" className="text-xl font-heading font-bold text-brand-charcoal mb-4">
                  References
                </h2>
                <ol className="space-y-2">
                  {article.sources.map((s: any, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-3">
                      <span className="text-brand-leaf font-mono font-bold shrink-0">[{i + 1}]</span>
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
                            View
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

            {/* Featured products */}
            {featuredProducts.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-brand-charcoal mb-3 text-lg">
                  Products in this guide
                </h2>
                <div className="space-y-4">
                  {featuredProducts.map((p: any) => (
                    <ProductCard
                      key={p.id ?? p}
                      name={p.name ?? p}
                      slug={p.slug ?? p}
                      brandName={typeof p.brand === 'object' ? p.brand?.name ?? '' : ''}
                      format={p.format}
                      price={p.price}
                      vegan={p.vegan === true || p.vegan === 'yes'}
                      thirdPartyTested={p.thirdPartyTested === true || p.thirdPartyTested === 'yes'}
                      imageUrl={typeof p.image === 'object' ? p.image?.url : undefined}
                      imageAlt={typeof p.image === 'object' ? p.image?.alt ?? p.name : undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Disclosure */}
            <SafetyWarningBox severity="info">
              <p className="text-xs leading-relaxed">
                Some links in this guide may be affiliate links. This does not affect our editorial
                judgement.{' '}
                <Link href="/affiliate-disclosure" className="underline">
                  Read our disclosure.
                </Link>
              </p>
            </SafetyWarningBox>
          </aside>
        </div>
      </div>
    </>
  )
}
