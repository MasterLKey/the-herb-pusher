import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  buying_guide: 'Buying Guide',
  comparison: 'Comparison',
  goal_guide: 'Goal Guide',
  myth_busting: 'Myth Busting',
  explainer: 'Explainer',
  news: 'Research',
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
    <article className={cn('card-base overflow-hidden hover:shadow-md transition-all group', className)}>
      {imageUrl && (
        <div className="relative aspect-video bg-brand-sage">
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge-pill bg-brand-sage text-brand-green text-xs">
            {TYPE_LABELS[type] ?? type}
          </span>
          {sponsored && (
            <span className="badge-pill bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-xs">
              Sponsored
            </span>
          )}
        </div>
        <Link href={`/guides/${slug}`} className="group-hover:text-brand-green transition-colors">
          <h3 className="font-bold text-brand-charcoal leading-snug">{title}</h3>
        </Link>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{excerpt}</p>
        {(publishedAt || author) && (
          <p className="text-xs text-gray-400">
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
