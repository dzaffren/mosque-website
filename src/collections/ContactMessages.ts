import type { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'subject', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Feedback', value: 'feedback' },
        { label: 'Inquiry', value: 'inquiry' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Star rating 1–5 (feedback only)' },
    },
  ],
  timestamps: true,
}
