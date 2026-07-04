import type { CollectionConfig } from 'payload'
import { indexDocument, deleteDocument } from '@/lib/search'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'publishedAt'],
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
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc.status === 'published') {
          await indexDocument('articles', {
            id: String(doc.id),
            title: doc.title,
            slug: doc.slug,
            excerpt: doc.excerpt,
            type: doc.type,
          })
        }
      },
    ],
    afterDelete: [
      async ({ id }) => {
        await deleteDocument('articles', String(id))
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Buying Guide', value: 'buying_guide' },
        { label: 'Comparison', value: 'comparison' },
        { label: 'Goal Guide', value: 'goal_guide' },
        { label: 'Myth Busting', value: 'myth_busting' },
        { label: 'How-To / Explainer', value: 'explainer' },
        { label: 'News / Research', value: 'news' },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: {
        description: 'Shown on article cards and in meta description.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredIngredients',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
    },
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'relatedGoals',
      type: 'relationship',
      relationTo: 'wellness-goals',
      hasMany: true,
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'reviewedBy',
      type: 'text',
    },
    {
      name: 'sponsored',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark if this article is a sponsored/partner piece.',
        position: 'sidebar',
      },
    },
    {
      name: 'sponsorName',
      type: 'text',
      admin: {
        condition: (data) => data.sponsored,
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
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
