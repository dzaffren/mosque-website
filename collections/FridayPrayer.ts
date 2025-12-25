import type { CollectionConfig } from 'payload'

export const FridayPrayer: CollectionConfig = {
  slug: 'friday-prayer',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Sermon Title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedAt',
      label: 'Date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'summary',
      label: 'Summary',
      type: 'textarea',
    },
    {
      name: 'topics',
      type: 'array',
      fields: [
        {
          name: 'topic',
          type: 'text',
        },
      ],
    },
  ],
}