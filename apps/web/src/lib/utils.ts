import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export function formatPricePerServing(pence: number): string {
  if (pence < 100) return `${pence}p per serving`
  return `${formatPrice(pence)} per serving`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const EVIDENCE_RATING_CONFIG = {
  strong: {
    label: 'Strong Evidence',
    colour: 'bg-brand-green text-brand-cream',
    icon: '✓',
    description: 'Well-supported by clinical evidence.',
  },
  moderate: {
    label: 'Moderate Evidence',
    colour: 'bg-brand-leaf text-white',
    icon: '◑',
    description: 'Some good evidence, but results may vary.',
  },
  early: {
    label: 'Early Evidence',
    colour: 'bg-brand-gold text-brand-charcoal',
    icon: '◔',
    description: 'Interesting but limited clinical evidence.',
  },
  traditional: {
    label: 'Traditional Use',
    colour: 'bg-brand-clay text-white',
    icon: '⌂',
    description: 'Long history of use; limited clinical evidence.',
  },
  hype: {
    label: 'Hype Alert',
    colour: 'bg-brand-charcoal text-brand-cream',
    icon: '!',
    description: 'Popular online, but the evidence is still catching up.',
  },
} as const

export type EvidenceRating = keyof typeof EVIDENCE_RATING_CONFIG
