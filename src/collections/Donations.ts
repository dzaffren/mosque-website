import type { CollectionConfig } from 'payload'

export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'amount', 'status', 'createdAt'],
  },
  access: {
    create: () => true, // Allow API route to create
    read: ({ req }) => Boolean(req.user),
    update: () => true, // Allow API route to update status
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'amount', type: 'number', required: true, admin: { description: 'Amount in RM' } },
    { name: 'billCode', type: 'text', admin: { description: 'TayyibPay bill code' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
    },
  ],
  timestamps: true,
}
