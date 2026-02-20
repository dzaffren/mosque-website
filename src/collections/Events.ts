import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'endDate', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'location', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
