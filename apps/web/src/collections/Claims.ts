import type { CollectionConfig } from 'payload'

export const Claims: CollectionConfig = {
  slug: 'claims',
  admin: {
    useAsTitle: 'claimText',
    defaultColumns: ['ingredient', 'claimText', 'status', 'approvedDate'],
  },
  fields: [
    {
      name: 'ingredient',
      type: 'relationship',
      relationTo: 'ingredients',
      required: true,
    },
    {
      name: 'claimText',
      type: 'text',
      required: true,
      admin: {
        description: 'Exact wording of the claim as it appears on the site.',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Reference for this claim.',
      },
    },
    {
      name: 'evidenceLevel',
      type: 'select',
      options: [
        { label: 'Strong', value: 'strong' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Early', value: 'early' },
        { label: 'Traditional', value: 'traditional' },
      ],
    },
    {
      name: 'authorisedClaim',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Is this an authorised claim from the GB nutrition and health claims register?',
      },
    },
    {
      name: 'claimRegisterId',
      type: 'text',
      label: 'GB Claim Register ID',
      admin: {
        condition: (data) => data.authorisedClaim,
      },
    },
    {
      name: 'countryApplicability',
      type: 'select',
      hasMany: true,
      defaultValue: ['gb'],
      options: [
        { label: 'Great Britain', value: 'gb' },
        { label: 'European Union', value: 'eu' },
        { label: 'United States', value: 'us' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reviewerName',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'approvedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      admin: {
        condition: (data) => data.status === 'rejected',
        position: 'sidebar',
      },
    },
  ],
}
