import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Shield } from 'lucide-react'
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
    <div className={cn('card-trading flex flex-col overflow-hidden', className)}>
      {/* Image area */}
      <div className="relative bg-white aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="size-12 text-brand-leaf/20" aria-hidden="true" />
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
        {/* Brand + name */}
        <div>
          <p className="section-label mb-1">{brandName}</p>
          <Link
            href={`/products/${slug}`}
            className="font-heading font-bold text-brand-charcoal hover:text-brand-green transition-colors leading-snug block"
          >
            {name}
          </Link>
          {format && <p className="text-xs text-gray-400 mt-0.5 capitalize">{format}</p>}
        </div>

        {/* Trust badges */}
        {(vegan || thirdPartyTested) && (
          <div className="flex flex-wrap gap-1.5">
            {vegan && (
              <span className="badge-pill bg-brand-sage text-brand-green">
                <Leaf className="size-3" aria-hidden="true" />
                Vegan
              </span>
            )}
            {thirdPartyTested && (
              <span className="badge-pill bg-brand-sage text-brand-green">
                <Shield className="size-3" aria-hidden="true" />
                Lab Tested
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 border-t border-brand-sage">
          {price != null ? (
            <div className="flex items-baseline justify-between">
              <p className="font-heading font-bold text-xl text-brand-charcoal">
                £{price.toFixed(2)}
              </p>
              {pricePerServing != null && (
                <p className="text-xs text-gray-400">
                  {pricePerServing < 100
                    ? `${pricePerServing}p/serving`
                    : `£${(pricePerServing / 100).toFixed(2)}/serving`}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Price not listed</p>
          )}
        </div>

        <Link href={`/products/${slug}`} className="btn-primary text-center text-sm">
          Check price
        </Link>
      </div>
    </div>
  )
}
