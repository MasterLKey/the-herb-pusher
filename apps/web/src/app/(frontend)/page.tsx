import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ArrowRight, CheckCircle2, FlaskConical, Sprout, Zap } from 'lucide-react'
import configPromise from '@payload-config'
import { SearchBar } from '@/components/ui/SearchBar'
import { IngredientCard } from '@/components/ingredient/IngredientCard'
import { GoalCard } from '@/components/ui/GoalCard'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { NewsletterSignupBox } from '@/components/ui/NewsletterSignupBox'
import type { EvidenceRating } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The Herb Pusher — Supplements Explained Without the Nonsense',
  description:
    'Evidence-rated vitamins, minerals, herbs and supplements. No hype, no miracle claims — just honest buying guides and clear science.',
}

async function getHomeData() {
  const payload = await getPayload({ config: configPromise })

  const [ingredients, goals, guides] = await Promise.all([
    payload.find({
      collection: 'ingredients',
      where: { status: { equals: 'published' } },
      sort: '-createdAt',
      limit: 6,
      depth: 0,
    }),
    payload.find({
      collection: 'wellness-goals',
      limit: 8,
      depth: 0,
    }),
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 0,
    }),
  ])

  return { ingredients: ingredients.docs, goals: goals.docs, guides: guides.docs }
}

const STATIC_GOALS = [
  { name: 'Sleep', slug: 'sleep', icon: 'sleep', shortDescription: 'Support deeper, more restful sleep naturally.' },
  { name: 'Energy', slug: 'energy', icon: 'energy', shortDescription: 'Fight fatigue and stay sharp all day.' },
  { name: 'Focus', slug: 'focus', icon: 'focus', shortDescription: 'Sharpen concentration and mental clarity.' },
  { name: 'Immune', slug: 'immune', icon: 'immune', shortDescription: 'Keep your defences up year-round.' },
  { name: 'Gut Health', slug: 'gut', icon: 'gut', shortDescription: 'Support digestion and your microbiome.' },
  { name: 'Bone', slug: 'bone', icon: 'bone', shortDescription: 'Build and maintain strong bones.' },
  { name: 'Muscle', slug: 'muscle', icon: 'muscle', shortDescription: 'Support recovery and strength gains.' },
  { name: 'Skin', slug: 'skin', icon: 'skin', shortDescription: 'Nourish skin from the inside out.' },
]

const STATIC_TRENDING = [
  { name: 'Magnesium', slug: 'magnesium', shortSummary: "The most common deficiency you've probably never tested for.", evidenceRating: 'strong' as EvidenceRating, category: 'mineral' },
  { name: 'Vitamin D', slug: 'vitamin-d', shortSummary: "Most people in the UK are deficient. Here's what to do about it.", evidenceRating: 'strong' as EvidenceRating, category: 'vitamin' },
  { name: 'Ashwagandha', slug: 'ashwagandha', shortSummary: 'The stress adaptogen with the most clinical backing.', evidenceRating: 'moderate' as EvidenceRating, category: 'herb' },
  { name: 'Creatine', slug: 'creatine', shortSummary: 'The most proven performance supplement in the world.', evidenceRating: 'strong' as EvidenceRating, category: 'amino_acid' },
  { name: 'Omega-3', slug: 'omega-3', shortSummary: "Essential fats most of us aren't getting enough of.", evidenceRating: 'moderate' as EvidenceRating, category: 'fatty_acid' },
  { name: "Lion's Mane", slug: 'lions-mane', shortSummary: 'The mushroom the internet is obsessed with. What does the science say?', evidenceRating: 'early' as EvidenceRating, category: 'mushroom' },
]

const EVIDENCE_STEPS = [
  {
    level: 'Strong Evidence',
    colour: 'bg-brand-green',
    desc: 'Well-supported by high-quality clinical trials and systematic reviews.',
    icon: CheckCircle2,
  },
  {
    level: 'Moderate Evidence',
    colour: 'bg-brand-leaf',
    desc: 'Good evidence from multiple studies; some variation in results.',
    icon: FlaskConical,
  },
  {
    level: 'Early Evidence',
    colour: 'bg-brand-gold',
    desc: 'Interesting preliminary research; more study needed.',
    icon: Sprout,
  },
  {
    level: 'Traditional Use',
    colour: 'bg-brand-clay',
    desc: 'Long history of use, limited modern clinical evidence.',
    icon: Zap,
  },
  {
    level: 'Hype Alert',
    colour: 'bg-brand-charcoal',
    desc: 'Popular online, but the evidence is still catching up.',
    icon: Zap,
  },
]

export default async function HomePage() {
  const { ingredients, goals, guides } = await getHomeData()

  const displayGoals = goals.length > 0 ? goals : STATIC_GOALS
  const displayIngredients = ingredients.length > 0 ? ingredients : STATIC_TRENDING
  const displayGuides = guides.length > 0 ? guides : []

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section
        className="bg-brand-green text-brand-cream py-20 md:py-28 relative overflow-hidden"
        aria-label="Site introduction"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none" aria-hidden="true">
          <div className="absolute top-8 right-12 text-[180px] leading-none font-heading font-bold text-brand-cream">
            THP
          </div>
        </div>

        <div className="container-content relative">
          <div className="max-w-3xl">
            <p className="section-label text-brand-gold mb-4">Evidence-first supplements</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-brand-cream leading-[1.05] mb-6">
              Supplements explained<br />
              <span className="text-brand-gold">without the nonsense.</span>
            </h1>
            <p className="text-brand-cream/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Evidence ratings, honest buying guides and real comparisons — so you can buy smarter,
              not just spend more.
            </p>

            {/* Hero search bar */}
            <SearchBar
              size="hero"
              className="max-w-2xl"
              placeholder="Search magnesium, turmeric, lion's mane…"
            />

            {/* Quick stat pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[
                'Evidence-rated ingredients',
                'Honest buying guides',
                'No miracle claims',
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-cream/70 bg-brand-cream/10 rounded-full px-3 py-1"
                >
                  <CheckCircle2 className="size-3.5 text-brand-gold" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Browse by Goal ──────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="goals-heading">
        <div className="container-content">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="section-label mb-2">Browse by goal</p>
              <h2 id="goals-heading" className="text-3xl md:text-4xl font-heading font-bold text-brand-charcoal">
                What are you working on?
              </h2>
            </div>
            <Link
              href="/goals"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-green hover:text-brand-leaf transition-colors shrink-0"
            >
              All goals <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {displayGoals.slice(0, 8).map((goal: any) => (
              <GoalCard
                key={goal.id ?? goal.slug}
                name={goal.name}
                slug={goal.slug}
                icon={goal.icon}
                shortDescription={goal.shortDescription}
                ingredientCount={Array.isArray(goal.ingredients) ? goal.ingredients.length : undefined}
              />
            ))}
          </div>

          <div className="sm:hidden mt-4 text-center">
            <Link href="/goals" className="btn-secondary">
              All wellness goals
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trending Ingredients ────────────────────────────── */}
      <section className="py-16 md:py-20 bg-brand-offwhite" aria-labelledby="trending-heading">
        <div className="container-content">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="section-label mb-2">Trending now</p>
              <h2 id="trending-heading" className="text-3xl md:text-4xl font-heading font-bold text-brand-charcoal">
                Popular ingredients
              </h2>
            </div>
            <Link
              href="/ingredients"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-green hover:text-brand-leaf transition-colors shrink-0"
            >
              Full database <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayIngredients.slice(0, 6).map((ing: any) => (
              <IngredientCard
                key={ing.id ?? ing.slug}
                name={ing.name}
                slug={ing.slug}
                shortSummary={ing.shortSummary}
                evidenceRating={(ing.evidenceRating ?? 'moderate') as EvidenceRating}
                category={ing.category}
              />
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link href="/ingredients" className="btn-secondary">
              Browse all ingredients
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Latest Buying Guides ────────────────────────────── */}
      {displayGuides.length > 0 && (
        <section className="py-16 md:py-20" aria-labelledby="guides-heading">
          <div className="container-content">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="section-label mb-2">Expert guidance</p>
                <h2 id="guides-heading" className="text-3xl md:text-4xl font-heading font-bold text-brand-charcoal">
                  Latest buying guides
                </h2>
              </div>
              <Link
                href="/guides"
                className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-green hover:text-brand-leaf transition-colors shrink-0"
              >
                All guides <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayGuides.map((article: any) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt ?? article.shortDescription ?? ''}
                  type={article.type ?? 'buying_guide'}
                  publishedAt={article.publishedAt}
                  sponsored={article.sponsored}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Evidence Meter Explainer ────────────────────────── */}
      <section className="py-16 md:py-20 bg-brand-charcoal text-brand-cream" aria-labelledby="evidence-heading">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="section-label text-brand-gold mb-3">How we rate everything</p>
            <h2 id="evidence-heading" className="text-3xl md:text-4xl font-heading font-bold mb-4">
              The Evidence Meter
            </h2>
            <p className="text-brand-cream/70 text-lg">
              Every ingredient gets an honest rating based on the quality and quantity of published
              research — not how good its marketing is.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
            {EVIDENCE_STEPS.map(({ level, colour, desc, icon: Icon }) => (
              <div key={level} className="flex flex-col gap-3 p-4 rounded-[var(--radius-card)] bg-brand-cream/5 border border-brand-cream/10">
                <div className={`w-8 h-8 rounded-lg ${colour} flex items-center justify-center shrink-0`} aria-hidden="true">
                  <Icon className="size-4 text-white" />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-brand-cream mb-1">{level}</p>
                  <p className="text-xs text-brand-cream/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/editorial-policy" className="btn-secondary border-brand-cream/20 text-brand-cream hover:bg-brand-cream/10">
              Read our editorial policy
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ──────────────────────────────────────── */}
      <section className="py-16 md:py-20" aria-labelledby="newsletter-heading">
        <div className="container-content">
          <div className="max-w-2xl mx-auto">
            <p className="section-label text-center mb-3">Every Friday</p>
            <h2 id="newsletter-heading" className="text-3xl md:text-4xl font-heading font-bold text-center text-brand-charcoal mb-3">
              The Friday Fix
            </h2>
            <p className="text-center text-gray-500 mb-8">
              One useful supplement tip each week. No wellness waffle.
            </p>
            <NewsletterSignupBox source="homepage" />
          </div>
        </div>
      </section>

      {/* ─── Affiliate disclosure footer note ───────────────── */}
      <div className="bg-brand-sage border-t border-brand-leaf/20 py-4">
        <div className="container-content">
          <p className="text-xs text-center text-gray-500">
            Some links on this site are affiliate links.{' '}
            <Link href="/affiliate-disclosure" className="underline hover:text-brand-green">
              Our opinions are always our own.
            </Link>{' '}
            Sponsored placements are clearly labelled.
          </p>
        </div>
      </div>
    </>
  )
}
