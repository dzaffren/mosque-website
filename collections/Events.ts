import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'eventTime', 'category'],
  },
  // 👇 RBAC Logic Applied
  access: {
    // Dev and Super Admin can delete; Normal Admin can manage content
    delete: ({ req: { user } }) => 
      ['dev', 'super-admin'].includes(user?.role),
    create: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    update: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    read: () => true, // Public access
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
    {
      name: 'eventTime',
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