import type { CollectionConfig } from 'payload'

export const KhutbahSchedule: CollectionConfig = {
  slug: 'khutbah-schedule',
  labels: { singular: 'Khutbah', plural: 'Khutbah Schedule' },
  admin: {
    useAsTitle: 'topic',
    defaultColumns: ['date', 'topic', 'speaker'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'topic', type: 'text', required: true },
    { name: 'speaker', type: 'text', required: true },
    { name: 'notes', type: 'textarea' },
    {
      name: 'sermonPdfUrl',
      type: 'text',
      admin: { description: 'URL to the sermon PDF (e.g. from e-Khutbah JAIS)' },
    },
  ],
}
