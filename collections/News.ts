import type { CollectionConfig } from 'payload'

const formatSlug = (val: string) =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
  },
  // 👇 RBAC Logic Applied
  access: {
    // Dev and Super Admin can delete; Normal Admin can only create/update
    delete: ({ req: { user } }) => 
      ['dev', 'super-admin'].includes(user?.role),
    create: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    update: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    read: () => true, // Public can read news articles
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return formatSlug(data.title)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Announcement', value: 'Announcement' },
        { label: 'Education', value: 'Education' },
        { label: 'Community', value: 'Community' },
        { label: 'Development', value: 'Development' },
      ],
    },
    {
      name: 'author',
      type: 'text',
      defaultValue: 'Mosque Admin',
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText', 
      label: 'Main Content',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}