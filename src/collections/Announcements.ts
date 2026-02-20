import type { CollectionConfig } from 'payload'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  labels: { singular: 'Announcement', plural: 'Announcements' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'priority'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
  ],
}
