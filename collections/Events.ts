import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'eventTime', 'category'], // 👈 Add default columns for a cleaner list
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'Community',
      options: [
        { label: 'Community', value: 'Community' },
        { label: 'Education', value: 'Education' },
        { label: 'Competition', value: 'Competition' },
        { label: 'Workshop', value: 'Workshop' },
      ],
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    // ❌ DELETED the old 'time' text field from here

    {
      name: 'eventTime', // ✅ Keeping only the new Date field
      label: 'Event Time',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
          displayFormat: 'h:mm a',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Main Prayer Hall',
    },
    {
      name: 'attendees',
      type: 'number',
      label: 'Expected Attendees',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}