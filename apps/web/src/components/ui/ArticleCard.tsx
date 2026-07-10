import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  buying_guide: 'Buying Guide',
  comparison: 'Comparison',
  goal_guide: 'Goal Guide',
  myth_busting: 'Myth Busting',
  explainer: 'Explainer',
  news: 'Research',
}

const TYPE_COLOURS: Record<string, string> = {
  buying_guide: 'bg-brand-green text-brand-cream',
  comparison: 'bg-brand-charcoal text-brand-cream',
  goal_guide: 'bg-brand-leaf text-white',
  myth_busting: 'bg-brand-clay text-white',
  explainer: 'bg-brand-sage text-brand-green',
  news: 'bg-brand-gold text-brand-charcoal',
}

interface ArticleCardProps {
  title: string
  slug: string
  excerpt: string
  type: string
  imageUrl?: string
  imageAlt?: string
  publishedAt?: string
  author?: string
  sponsored?: boolean
  className?: string
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  type,
  imageUrl,
  imageAlt,
  publishedAt,
  author,
  sponsored,
  className,
}: ArticleCardProps) {
  return (
    <article className={cn('card-trading group overflow-hidden', className)}>
      {/* Cover image */}
      {imageUrl && (
        <div className="relative aspect-video bg-brand-sage overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* No image: coloured header strip */}
      {!imageUrl && (
        <div className="h-1.5 bg-brand-green" aria-hidden="true" />
      )}

      <div className="p-5 flex flex-col gap-3">
        {/* Type badge row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn('badge-pill', TYPE_COLOURS[type] ?? 'bg-brand-sage text-brand-green')}>
              {TYPE_LABELS[type] ?? type}
            </span>
            {sponsored && (
              <span className="badge-pill bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                Sponsored
              </span>
            )}
          </div>
          <ArrowRight
            className="size-4 text-gray-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <Link href={`/guides/${slug}`}>
          <h3 className="font-heading font-bold text-brand-charcoal leading-snug group-hover:text-brand-green transition-colors">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{excerpt}</p>

        {/* Meta */}
        {(publishedAt || author) && (
          <p className="text-xs text-gray-400 mt-auto pt-2 border-t border-brand-sage">
            {author && <span>By {author}</span>}
            {author && publishedAt && <span className="mx-1">·</span>}
            {publishedAt && (
              <time dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </p>
        )}
      </div>
    </article>
  )
}
