import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/SearchBar'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import type { EvidenceRating } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Search — The Herb Pusher',
}

const TYPE_LABELS: Record<string, string> = {
  ingredient: 'Ingredient',
  product: 'Product',
  article: 'Guide',
  goal: 'Goal',
}

interface SearchResult {
  id: string
  type: 'ingredient' | 'product' | 'article' | 'goal'
  title: string
  slug: string
  summary?: string
  evidenceRating?: EvidenceRating
}

async function search(query: string): Promise<SearchResult[]> {
  if (!query) return []

  const host = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
  const apiKey = process.env.MEILISEARCH_API_KEY || ''

  try {
    const res = await fetch(`${host}/multi-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        queries: [
          { indexUid: 'ingredients', q: query, limit: 5 },
          { indexUid: 'products', q: query, limit: 5 },
          { indexUid: 'articles', q: query, limit: 5 },
          { indexUid: 'wellness-goals', q: query, limit: 3 },
        ],
      }),
      next: { revalidate: 60 },
    })

    if (!res.ok) return []

    const data = await res.json()
    const results: SearchResult[] = []

    const [ingredientRes, productRes, articleRes, goalRes] = data.results ?? []

    for (const hit of ingredientRes?.hits ?? []) {
      results.push({ id: hit.id, type: 'ingredient', title: hit.name, slug: hit.slug, summary: hit.shortSummary, evidenceRating: hit.evidenceRating })
    }
    for (const hit of productRes?.hits ?? []) {
      results.push({ id: hit.id, type: 'product', title: hit.name, slug: hit.slug, summary: hit.shortDescription })
    }
    for (const hit of articleRes?.hits ?? []) {
      results.push({ id: hit.id, type: 'article', title: hit.title, slug: hit.slug, summary: hit.excerpt })
    }
    for (const hit of goalRes?.hits ?? []) {
      results.push({ id: hit.id, type: 'goal', title: hit.name, slug: hit.slug, summary: hit.shortDescription })
    }

    return results
  } catch {
    return []
  }
}

function getResultHref(type: string, slug: string): string {
  switch (type) {
    case 'ingredient': return `/ingredients/${slug}`
    case 'product': return `/products/${slug}`
    case 'article': return `/guides/${slug}`
    case 'goal': return `/goals/${slug}`
    default: return `/${slug}`
  }
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const results = await search(q)

  return (
    <div className="container-content py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-charcoal mb-4">Search</h1>
      <SearchBar size="default" initialQuery={q} className="mb-8" />

      {q && (
        <p className="text-sm text-gray-500 mb-6">
          {results.length === 0
            ? 'No herbs found hiding in the cupboard.'
            : `${results.length} result${results.length !== 1 ? 's' : ''} for "${q}"`}
        </p>
      )}

      {results.length > 0 && (
        <ul className="space-y-4" role="list" aria-label="Search results">
          {results.map((r) => (
            <li key={`${r.type}-${r.id}`}>
              <Link
                href={getResultHref(r.type, r.slug)}
                className="card-base p-5 flex flex-col gap-2 hover:border-brand-leaf hover:shadow-md transition-all block"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge-pill bg-brand-sage text-brand-green text-xs">
                    {TYPE_LABELS[r.type] ?? r.type}
                  </span>
                  {r.evidenceRating && (
                    <EvidenceBadge rating={r.evidenceRating} size="sm" />
                  )}
                </div>
                <p className="font-semibold text-brand-charcoal">{r.title}</p>
                {r.summary && (
                  <p className="text-sm text-gray-600 line-clamp-2">{r.summary}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!q && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3" aria-hidden="true">🔍</p>
          <p>Search for a vitamin, mineral, herb or supplement.</p>
        </div>
      )}
    </div>
  )
}
