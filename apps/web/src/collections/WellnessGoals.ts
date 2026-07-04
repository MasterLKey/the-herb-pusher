import type { CollectionConfig } from 'payload'

export const WellnessGoals: CollectionConfig = {
  slug: 'wellness-goals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
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
    },
    {
      name: 'icon',
      type: 'select',
      options: [
        { label: 'Sleep', value: 'sleep' },
        { label: 'Energy', value: 'energy' },
        { label: 'Focus', value: 'focus' },
        { label: 'Immune', value: 'immune' },
        { label: 'Gut', value: 'gut' },
        { label: 'Bone', value: 'bone' },
        { label: 'Muscle', value: 'muscle' },
        { label: 'Skin', value: 'skin' },
        { label: 'Stress', value: 'stress' },
        { label: 'Wellbeing', value: 'wellbeing' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'text',
      required: true,
      admin: {
        description: 'One sentence shown on goal cards.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'lifestyleNotes',
      type: 'textarea',
      admin: {
        description: 'General lifestyle context (non-medical).',
      },
    },
    {
      name: 'safetyWarning',
      type: 'textarea',
      admin: {
        description: 'Safety disclaimer shown on the goal page.',
      },
    },
    {
      name: 'ingredients',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
      admin: {
        description: 'Ingredients relevant to this wellness goal.',
      },
    },
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'relatedGuides',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
