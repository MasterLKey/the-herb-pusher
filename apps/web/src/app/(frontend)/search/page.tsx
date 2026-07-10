import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import type { EvidenceRating } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search ingredients, products, guides and wellness goals.',
}

const TYPE_LABELS: Record<string, string> = {
  ingredient: 'Ingredient',
  product: 'Product',
  article: 'Guide',
  goal: 'Goal',
}

const TYPE_COLOURS: Record<string, string> = {
  ingredient: 'bg-brand-green text-brand-cream',
  product: 'bg-brand-charcoal text-brand-cream',
  article: 'bg-brand-gold text-brand-charcoal',
  goal: 'bg-brand-leaf text-white',
}

interface SearchResult {
  id: string
  type: 'ingredient' | 'product' | 'article' | 'goal'
  title: string
  slug: string
  summary?: string
  evidenceRating?: EvidenceRating
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

async function search(query: string): Promise<SearchResult[]> {
  if (!query) return []
  const host = process.env.MEILISEARCH_HOST || 'http://search:7700'
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

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const results = await search(q)

  return (
    <>
      {/* Header bar */}
      <div className="bg-brand-charcoal text-brand-cream py-10 md:py-14">
        <div className="container-content max-w-3xl">
          <h1 className="text-4xl font-heading font-bold mb-6">Search</h1>
          <SearchBar
            size="hero"
            initialQuery={q}
            placeholder="Search magnesium, turmeric, lion's mane…"
          />
        </div>
      </div>

      <div className="container-content py-8 max-w-3xl">

        {/* Results count */}
        {q && (
          <p className="text-sm text-gray-500 mb-6">
            {results.length === 0
              ? <span>No herbs found hiding in the cupboard. Try a different search.</span>
              : <span><strong className="text-brand-charcoal">{results.length}</strong> result{results.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;</span>}
          </p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <ul className="space-y-3" role="list" aria-label="Search results">
            {results.map((r) => (
              <li key={`${r.type}-${r.id}`}>
                <Link
                  href={getResultHref(r.type, r.slug)}
                  className="card-trading p-5 flex items-start gap-4 group block"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`badge-pill ${TYPE_COLOURS[r.type] ?? 'bg-brand-sage text-brand-green'}`}>
                        {TYPE_LABELS[r.type] ?? r.type}
                      </span>
                      {r.evidenceRating && (
                        <EvidenceBadge rating={r.evidenceRating} size="sm" />
                      )}
                    </div>
                    <p className="font-heading font-bold text-brand-charcoal group-hover:text-brand-green transition-colors">
                      {r.title}
                    </p>
                    {r.summary && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{r.summary}</p>
                    )}
                  </div>
                  <ArrowRight
                    className="size-4 text-gray-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {!q && (
          <div className="text-center py-16">
            <Search className="size-12 mx-auto mb-4 text-brand-sage" aria-hidden="true" />
            <p className="font-heading font-bold text-lg text-gray-500 mb-3">
              What are you looking for?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Search for a vitamin, mineral, herb or supplement.
            </p>
            {/* Quick links */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['Magnesium', 'Vitamin D', 'Ashwagandha', 'Creatine', "Omega-3", "Lion's Mane"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="badge-pill bg-brand-offwhite text-brand-charcoal border border-brand-sage hover:border-brand-leaf transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
