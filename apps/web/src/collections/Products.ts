import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'status', 'lastReviewed'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'live' } }
    },
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Vitamin', value: 'vitamin' },
        { label: 'Mineral', value: 'mineral' },
        { label: 'Herb / Botanical', value: 'herb' },
        { label: 'Amino Acid', value: 'amino_acid' },
        { label: 'Omega / Fatty Acid', value: 'omega' },
        { label: 'Probiotic', value: 'probiotic' },
        { label: 'Mushroom', value: 'mushroom' },
        { label: 'Multivitamin', value: 'multivitamin' },
        { label: 'Protein', value: 'protein' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'activeIngredients',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
    },
    {
      name: 'shortDescription',
      type: 'text',
      maxLength: 200,
    },
    {
      name: 'format',
      type: 'select',
      options: [
        { label: 'Capsule', value: 'capsule' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Softgel', value: 'softgel' },
        { label: 'Gummy', value: 'gummy' },
        { label: 'Powder', value: 'powder' },
        { label: 'Liquid', value: 'liquid' },
        { label: 'Spray', value: 'spray' },
        { label: 'Patch', value: 'patch' },
        { label: 'Tea / Sachet', value: 'tea' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'dosePerServing',
      type: 'text',
      label: 'Dose Per Serving',
      admin: {
        description: 'E.g. "1000 IU", "200mg", "2 capsules"',
      },
    },
    {
      name: 'servingsPerContainer',
      type: 'number',
      label: 'Servings Per Container',
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Price in GBP (£)',
      },
    },
    {
      name: 'pricePerServing',
      type: 'number',
      admin: {
        description: 'Auto-calculate or enter manually in pence.',
        readOnly: false,
      },
    },
    {
      name: 'vegan',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'vegetarian',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'glutenFree',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'sugarFree',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'thirdPartyTested',
      type: 'select',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'allergenNotes',
      type: 'textarea',
    },
    {
      name: 'pros',
      type: 'array',
      fields: [{ name: 'pro', type: 'text', required: true }],
    },
    {
      name: 'cons',
      type: 'array',
      fields: [{ name: 'con', type: 'text', required: true }],
    },
    {
      name: 'whoItMaySuit',
      type: 'textarea',
    },
    {
      name: 'whoShouldBeCautious',
      type: 'textarea',
    },
    {
      name: 'editorialRating',
      type: 'number',
      min: 0,
      max: 10,
      admin: {
        description: 'Editorial score out of 10.',
      },
    },
    {
      name: 'sponsored',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this product in a paid sponsored placement?',
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
        { label: 'Live', value: 'live' },
        { label: 'Hidden', value: 'hidden' },
      ],
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
