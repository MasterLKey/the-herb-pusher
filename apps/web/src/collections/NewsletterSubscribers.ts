import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'source', 'active'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return ['super_admin', 'affiliate_manager'].includes((user as any).role)
    },
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => {
      if (!user) return false
      return (user as any).role === 'super_admin'
    },
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Homepage', value: 'homepage' },
        { label: 'Ingredient Page', value: 'ingredient' },
        { label: 'Guide', value: 'guide' },
        { label: 'Goal Page', value: 'goal' },
        { label: 'Product Page', value: 'product' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
