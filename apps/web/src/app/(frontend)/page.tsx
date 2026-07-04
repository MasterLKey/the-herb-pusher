import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, BookOpen } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'
import { NewsletterSignupBox } from '@/components/ui/NewsletterSignupBox'
import { GoalCard } from '@/components/ui/GoalCard'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { EvidenceBadge } from '@/components/ui/EvidenceBadge'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const metadata: Metadata = {
  title: 'The Herb Pusher — Supplements Explained Without the Nonsense',
  description:
    'Your no-BS guide to vitamins, minerals, herbs and supplements. Evidence ratings, buying guides and honest product comparisons.',
  openGraph: {
    title: 'The Herb Pusher',
    description: 'Supplements explained without the nonsense.',
    type: 'website',
  },
}

async function getHomepageData() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [goals, ingredients, articles] = await Promise.all([
      payload.find({ collection: 'wellness-goals', limit: 8, depth: 0 }),
      payload.find({
        collection: 'ingredients',
        where: { status: { equals: 'published' } },
        limit: 6,
        depth: 0,
      }),
      payload.find({
        collection: 'articles',
        where: { status: { equals: 'published' } },
        limit: 3,
        depth: 0,
        sort: '-publishedAt',
      }),
    ])

    return { goals: goals.docs, ingredients: ingredients.docs, articles: articles.docs }
  } catch {
    return { goals: [], ingredients: [], articles: [] }
  }
}

const EVIDENCE_METER_ITEMS = [
  { rating: 'strong', description: 'Strong human evidence and recognised use.' },
  { rating: 'moderate', description: 'Good evidence but results vary.' },
  { rating: 'early', description: 'Early or mixed findings.' },
  { rating: 'traditional', description: 'Traditional use, limited clinical data.' },
  { rating: 'hype', description: 'Popular online, but weak evidence.' },
] as const

export default async function HomePage() {
  const { goals, ingredients, articles } = await getHomepageData()

  return (
    <div className="bg-brand-cream">
      {/* Hero */}
      <section className="bg-brand-green text-brand-cream py-16 md:py-24">
        <div className="container-content text-center max-w-3xl mx-auto">
          <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-4">
            Pushing herbs. Not hype.
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Supplements explained{' '}
            <span className="text-brand-gold">without the nonsense.</span>
          </h1>
          <p className="text-brand-cream/80 text-lg mb-8 max-w-xl mx-auto">
            Evidence ratings, honest buying guides and product comparisons — for vitamins, minerals,
            herbs and supplements.
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar size="hero" />
          </div>
          <p className="text-brand-cream/50 text-xs mt-4">
            Try: magnesium, ashwagandha, vitamin D, creatine, lion's mane
          </p>
        </div>
      </section>

      {/* Wellness Goals */}
      <section className="py-14 container-content">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">What are you trying to support?</h2>
            <p className="text-gray-600 text-sm mt-1">Browse by wellness goal — no medical claims, just honest information.</p>
          </div>
          <Link
            href="/goals"
            className="hidden sm:flex items-center gap-1 text-brand-green font-medium text-sm hover:underline"
          >
            All goals <ArrowRight className="size-4" />
          </Link>
        </div>
        {goals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {goals.map((goal: any) => (
              <GoalCard
                key={goal.id}
                name={goal.name}
                slug={goal.slug}
                icon={goal.icon}
                shortDescription={goal.shortDescription}
                ingredientCount={goal.ingredients?.length}
              />
            ))}
          </div>
        ) : (
          <GoalPlaceholderGrid />
        )}
      </section>

      {/* Trending Ingredients */}
      <section className="py-14 bg-brand-offwhite">
        <div className="container-content">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-brand-charcoal">Trending ingredients</h2>
              <p className="text-gray-600 text-sm mt-1">Popular right now, explained properly.</p>
            </div>
            <Link
              href="/ingredients"
              className="hidden sm:flex items-center gap-1 text-brand-green font-medium text-sm hover:underline"
            >
              All ingredients <ArrowRight className="size-4" />
            </Link>
          </div>
          {ingredients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((ing: any) => (
                <IngredientCard
                  key={ing.id}
                  name={ing.name}
                  slug={ing.slug}
                  shortSummary={ing.shortSummary}
                  evidenceRating={ing.evidenceRating}
                  category={ing.category}
                />
              ))}
            </div>
          ) : (
            <IngredientPlaceholderGrid />
          )}
        </div>
      </section>

      {/* Buying Guides */}
      {articles.length > 0 && (
        <section className="py-14 container-content">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-brand-charcoal">Latest buying guides</h2>
              <p className="text-gray-600 text-sm mt-1">Product comparisons and no-BS advice.</p>
            </div>
            <Link
              href="/guides"
              className="hidden sm:flex items-center gap-1 text-brand-green font-medium text-sm hover:underline"
            >
              All guides <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
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
        </section>
      )}

      {/* Evidence Meter Explainer */}
      <section className="py-14 bg-brand-charcoal text-brand-cream">
        <div className="container-content max-w-4xl">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="size-5 text-brand-gold" aria-hidden="true" />
              <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
                The Evidence Meter
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-3">We rate the evidence, not just the hype</h2>
            <p className="text-brand-cream/70 max-w-xl mx-auto text-sm">
              Every ingredient on The Herb Pusher gets an evidence rating. Here's what each level
              means, in plain English.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {EVIDENCE_METER_ITEMS.map(({ rating, description }) => (
              <div key={rating} className="bg-brand-cream/5 rounded-lg p-4 text-center">
                <EvidenceBadge rating={rating} size="sm" className="mb-2 mx-auto" />
                <p className="text-xs text-brand-cream/60 mt-2 leading-snug">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Value Props */}
      <section className="py-14 container-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              Icon: Zap,
              title: 'Cut through the hype',
              body: 'We tell you what the evidence actually says — not what the marketing copy claims.',
            },
            {
              Icon: BookOpen,
              title: 'Compare properly',
              body: 'Price-per-serving, ingredient forms, third-party testing — the things that actually matter.',
            },
            {
              Icon: Shield,
              title: 'No hidden agenda',
              body: 'Affiliate links are clearly labelled. Our evidence ratings are editorial, not commercial.',
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div className="bg-brand-sage rounded-full p-4">
                <Icon className="size-6 text-brand-green" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-brand-charcoal">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 container-content max-w-2xl">
        <NewsletterSignupBox source="homepage" />
      </section>
    </div>
  )
}

function GoalPlaceholderGrid() {
  const placeholders = [
    { name: 'Sleep Routine', slug: 'sleep', icon: 'sleep', shortDescription: 'Support your evening wind-down.' },
    { name: 'Energy Support', slug: 'energy', icon: 'energy', shortDescription: 'Maintain normal energy levels.' },
    { name: 'Focus & Concentration', slug: 'focus', icon: 'focus', shortDescription: 'Help maintain mental clarity.' },
    { name: 'Immune Support', slug: 'immune', icon: 'immune', shortDescription: 'Support your immune system.' },
    { name: 'Gut Health', slug: 'gut', icon: 'gut', shortDescription: 'Support digestive wellbeing.' },
    { name: 'Bone Health', slug: 'bone', icon: 'bone', shortDescription: 'Maintain normal bone function.' },
    { name: 'Muscle Function', slug: 'muscle', icon: 'muscle', shortDescription: 'Support muscle performance.' },
    { name: 'Skin, Hair & Nails', slug: 'skin', icon: 'skin', shortDescription: 'Nourish from the inside out.' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {placeholders.map((g) => (
        <GoalCard key={g.slug} {...g} />
      ))}
    </div>
  )
}

function IngredientPlaceholderGrid() {
  const placeholders = [
    { name: 'Magnesium', slug: 'magnesium', shortSummary: 'An essential mineral involved in hundreds of bodily processes, from muscle function to sleep.', evidenceRating: 'strong' as const, category: 'mineral' },
    { name: 'Vitamin D', slug: 'vitamin-d', shortSummary: 'The sunshine vitamin — important for bones, immune function and mood, especially in winter.', evidenceRating: 'strong' as const, category: 'vitamin' },
    { name: 'Ashwagandha', slug: 'ashwagandha', shortSummary: 'An ancient adaptogenic herb used in Ayurvedic medicine, with growing evidence for stress support.', evidenceRating: 'moderate' as const, category: 'herb' },
    { name: 'Omega-3', slug: 'omega-3', shortSummary: 'Essential fatty acids that support heart health, brain function and normal inflammatory response.', evidenceRating: 'strong' as const, category: 'fatty_acid' },
    { name: 'Creatine', slug: 'creatine', shortSummary: 'One of the most well-researched sports supplements, supporting muscle strength and power output.', evidenceRating: 'strong' as const, category: 'amino_acid' },
    { name: "Lion's Mane", slug: 'lions-mane', shortSummary: 'A functional mushroom with early evidence for cognitive support and nerve health.', evidenceRating: 'early' as const, category: 'mushroom' },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {placeholders.map((ing) => (
        <IngredientCard key={ing.slug} {...ing} />
      ))}
    </div>
  )
}
