import type { CollectionConfig } from 'payload'

export const Pledges: CollectionConfig = {
  slug: 'pledges',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'monthlyAmount', 'status', 'nextBillDate'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: () => true,
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'monthlyAmount', type: 'number', required: true, admin: { description: 'Monthly pledge amount in RM' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'nextBillDate',
      type: 'date',
      admin: { description: 'Date when the next monthly bill should be created' },
    },
    {
      name: 'lastBillCode',
      type: 'text',
      admin: { description: 'TayyibPay bill code from the most recent bill' },
    },
  ],
  timestamps: true,
}
