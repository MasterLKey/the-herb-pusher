import type { CollectionConfig } from 'payload'

export const EVIDENCE_RATINGS = [
  { label: 'Strong Evidence', value: 'strong' },
  { label: 'Moderate Evidence', value: 'moderate' },
  { label: 'Early Evidence', value: 'early' },
  { label: 'Traditional Use', value: 'traditional' },
  { label: 'Hype Alert', value: 'hype' },
]

export const INGREDIENT_STATUSES = [
  { label: 'Draft', value: 'draft' },
  { label: 'Evidence Review', value: 'evidence_review' },
  { label: 'Compliance Review', value: 'compliance_review' },
  { label: 'Published', value: 'published' },
  { label: 'Review Due', value: 'review_due' },
]

export const Ingredients: CollectionConfig = {
  slug: 'ingredients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'evidenceRating', 'status', 'lastReviewed'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug, e.g. "vitamin-d3" or "magnesium-glycinate".',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Vitamin', value: 'vitamin' },
        { label: 'Mineral', value: 'mineral' },
        { label: 'Herb', value: 'herb' },
        { label: 'Amino Acid', value: 'amino_acid' },
        { label: 'Fatty Acid', value: 'fatty_acid' },
        { label: 'Probiotic', value: 'probiotic' },
        { label: 'Mushroom', value: 'mushroom' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'shortSummary',
      type: 'text',
      required: true,
      maxLength: 200,
      admin: {
        description: 'One or two sentences shown on cards and in search results.',
      },
    },
    {
      name: 'overview',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Plain-English explanation of what it is.',
      },
    },
    {
      name: 'evidenceRating',
      type: 'select',
      required: true,
      options: EVIDENCE_RATINGS,
    },
    {
      name: 'evidenceSummary',
      type: 'textarea',
      admin: {
        description: 'Brief explanation of the evidence quality for this ingredient.',
      },
    },
    {
      name: 'commonUses',
      type: 'array',
      admin: {
        description: 'What people commonly take this for.',
      },
      fields: [
        {
          name: 'use',
          type: 'text',
          required: true,
        },
        {
          name: 'evidenceLevel',
          type: 'select',
          options: EVIDENCE_RATINGS,
        },
      ],
    },
    {
      name: 'approvedClaims',
      type: 'array',
      admin: {
        description: 'Only authorised health claims per the GB register.',
      },
      fields: [
        {
          name: 'claim',
          type: 'text',
          required: true,
        },
        {
          name: 'claimId',
          type: 'text',
          label: 'Claim Register ID',
        },
      ],
    },
    {
      name: 'cautions',
      type: 'array',
      admin: {
        description: 'Safety notes, interactions, pregnancy considerations.',
      },
      fields: [
        {
          name: 'caution',
          type: 'text',
          required: true,
        },
        {
          name: 'severity',
          type: 'select',
          options: [
            { label: 'Information', value: 'info' },
            { label: 'Caution', value: 'caution' },
            { label: 'Warning', value: 'warning' },
          ],
        },
      ],
    },
    {
      name: 'foodSources',
      type: 'array',
      fields: [
        {
          name: 'source',
          type: 'text',
          required: true,
        },
        {
          name: 'notes',
          type: 'text',
        },
      ],
    },
    {
      name: 'productTypes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Capsules', value: 'capsules' },
        { label: 'Tablets', value: 'tablets' },
        { label: 'Powder', value: 'powder' },
        { label: 'Gummies', value: 'gummies' },
        { label: 'Liquid / Tincture', value: 'liquid' },
        { label: 'Tea', value: 'tea' },
        { label: 'Spray', value: 'spray' },
        { label: 'Patch', value: 'patch' },
      ],
    },
    {
      name: 'commonForms',
      type: 'array',
      admin: {
        description: 'E.g. magnesium glycinate, citrate, oxide — with notes on differences.',
      },
      fields: [
        {
          name: 'form',
          type: 'text',
          required: true,
        },
        {
          name: 'notes',
          type: 'textarea',
        },
        {
          name: 'recommended',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'buyingGuide',
      type: 'richText',
      admin: {
        description: 'What to look for when buying this ingredient.',
      },
    },
    {
      name: 'sources',
      type: 'relationship',
      relationTo: 'evidence-sources',
      hasMany: true,
    },
    {
      name: 'relatedIngredients',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
    },
    {
      name: 'wellnessGoals',
      type: 'relationship',
      relationTo: 'wellness-goals',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: INGREDIENT_STATUSES,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lastReviewed',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewedBy',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
