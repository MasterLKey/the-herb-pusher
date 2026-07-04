import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theherbpusher.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/ingredients`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/goals`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/guides`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/affiliate-disclosure`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/disclaimer`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/editorial-policy`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const payload = await getPayload({ config: configPromise })

    const [ingredients, products, goals, articles] = await Promise.all([
      payload.find({ collection: 'ingredients', where: { status: { equals: 'published' } }, limit: 1000, depth: 0 }),
      payload.find({ collection: 'products', where: { status: { equals: 'live' } }, limit: 1000, depth: 0 }),
      payload.find({ collection: 'wellness-goals', limit: 100, depth: 0 }),
      payload.find({ collection: 'articles', where: { status: { equals: 'published' } }, limit: 1000, depth: 0 }),
    ])

    for (const ing of ingredients.docs) {
      urls.push({
        url: `${siteUrl}/ingredients/${ing.slug}`,
        changeFrequency: 'monthly',
        priority: 0.8,
        lastModified: ing.updatedAt ? new Date(ing.updatedAt) : undefined,
      })
    }

    for (const p of products.docs) {
      urls.push({
        url: `${siteUrl}/products/${p.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      })
    }

    for (const g of goals.docs) {
      urls.push({ url: `${siteUrl}/goals/${g.slug}`, changeFrequency: 'weekly', priority: 0.7 })
    }

    for (const a of articles.docs) {
      urls.push({
        url: `${siteUrl}/guides/${a.slug}`,
        changeFrequency: 'monthly',
        priority: 0.75,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
      })
    }
  } catch {
    // DB not available during static build — return static URLs only
  }

  return urls
}
