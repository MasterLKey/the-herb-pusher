import type { CollectionConfig } from 'payload'

export const EvidenceSources: CollectionConfig = {
  slug: 'evidence-sources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'year', 'qualityScore'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'doi',
      type: 'text',
      label: 'DOI',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Systematic Review / Meta-analysis', value: 'meta_analysis' },
        { label: 'Randomised Controlled Trial', value: 'rct' },
        { label: 'Observational Study', value: 'observational' },
        { label: 'Clinical Guideline', value: 'guideline' },
        { label: 'Narrative Review', value: 'review' },
        { label: 'Case Study', value: 'case_study' },
      ],
    },
    {
      name: 'year',
      type: 'number',
    },
    {
      name: 'qualityScore',
      type: 'select',
      label: 'Evidence Quality',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Low', value: 'low' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this source.',
      },
    },
  ],
}
