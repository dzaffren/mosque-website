import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery Image', plural: 'Gallery' },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'category', 'image'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Events', value: 'events' },
        { label: 'Ramadan', value: 'ramadan' },
        { label: 'Eid', value: 'eid' },
        { label: 'Community', value: 'community' },
        { label: 'Mosque', value: 'mosque' },
      ],
    },
  ],
}
