import type { CollectionConfig } from 'payload'

export const FridayPrayer: CollectionConfig = {
  slug: 'friday-prayer',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt'],
  },
  // 👇 RBAC Logic Applied
  access: {
    // Dev and Super Admin can delete; Normal Admin can only manage content
    delete: ({ req: { user } }) => 
      ['dev', 'super-admin'].includes(user?.role),
    create: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    update: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    read: () => true, // Public access for the frontend
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
        date: { 
          pickerAppearance: 'dayOnly' 
        },
      },
    },
    {
      name: 'summary',
      label: 'Summary',
      type: 'textarea',
    },
    {
      name: 'topics',
      label: 'Key Topics/Points',
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