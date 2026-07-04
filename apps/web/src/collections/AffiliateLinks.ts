import type { CollectionConfig } from 'payload'

export const AffiliateLinks: CollectionConfig = {
  slug: 'affiliate-links',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['product', 'retailer', 'price', 'active', 'lastChecked'],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'retailer',
      type: 'relationship',
      relationTo: 'retailers',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Full affiliate tracking URL.',
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Current price in GBP.',
      },
    },
    {
      name: 'lastChecked',
      type: 'date',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes, e.g. commission rate or deal details.',
      },
    },
  ],
}
