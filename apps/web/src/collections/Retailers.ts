import type { CollectionConfig } from 'payload'

export const Retailers: CollectionConfig = {
  slug: 'retailers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'affiliateProgram', 'updatedAt'],
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'baseUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'affiliateProgram',
      type: 'select',
      options: [
        { label: 'Amazon Associates', value: 'amazon' },
        { label: 'Awin', value: 'awin' },
        { label: 'Partnerize', value: 'partnerize' },
        { label: 'Direct / Manual', value: 'direct' },
        { label: 'None', value: 'none' },
      ],
    },
    {
      name: 'trackingNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about tracking setup.',
      },
    },
  ],
}
