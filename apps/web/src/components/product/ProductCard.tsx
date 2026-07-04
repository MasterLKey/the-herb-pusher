import Link from 'next/link'
import Image from 'next/image'
import { Leaf, TestTube } from 'lucide-react'
import { SponsoredLabel } from '@/components/ui/SponsoredLabel'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  name: string
  slug: string
  brandName: string
  format?: string
  price?: number
  pricePerServing?: number
  vegan?: boolean
  thirdPartyTested?: boolean
  sponsored?: boolean
  imageUrl?: string
  imageAlt?: string
  className?: string
}

export function ProductCard({
  name,
  slug,
  brandName,
  format,
  price,
  pricePerServing,
  vegan,
  thirdPartyTested,
  sponsored,
  imageUrl,
  imageAlt,
  className,
}: ProductCardProps) {
  return (
    <div className={cn('card-base flex flex-col overflow-hidden', className)}>
      {/* Image */}
      <div className="relative bg-brand-sage aspect-square">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-brand-leaf/30">
            <span className="text-5xl" aria-hidden="true">⬡</span>
          </div>
        )}
        {sponsored && (
          <div className="absolute top-2 left-2">
            <SponsoredLabel />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs text-brand-leaf font-medium uppercase tracking-wide">{brandName}</p>
          <Link
            href={`/products/${slug}`}
            className="font-semibold text-brand-charcoal hover:text-brand-green transition-colors leading-tight block mt-0.5"
          >
            {name}
          </Link>
          {format && <p className="text-xs text-gray-500 mt-0.5">{format}</p>}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {vegan && (
            <span className="badge-pill bg-brand-sage text-brand-green border border-brand-leaf/30">
              <Leaf className="size-3" aria-hidden="true" />
              Vegan
            </span>
          )}
          {thirdPartyTested && (
            <span className="badge-pill bg-brand-sage text-brand-green border border-brand-leaf/30">
              <TestTube className="size-3" aria-hidden="true" />
              3rd Party Tested
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-2 border-t border-brand-sage">
          {price != null ? (
            <div>
              <p className="font-bold text-brand-charcoal">
                £{(price).toFixed(2)}
              </p>
              {pricePerServing != null && (
                <p className="text-xs text-gray-500">
                  {pricePerServing < 100
                    ? `${pricePerServing}p per serving`
                    : `£${(pricePerServing / 100).toFixed(2)} per serving`}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Price not listed</p>
          )}
        </div>

        <Link
          href={`/products/${slug}`}
          className="btn-secondary text-center text-sm"
        >
          View product
        </Link>
      </div>
    </div>
  )
}
