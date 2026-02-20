import type { CollectionConfig } from 'payload'

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Staff Member', plural: 'Staff' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Imam', value: 'imam' },
        { label: 'Ustaz', value: 'ustaz' },
        { label: 'Committee Member', value: 'committee' },
        { label: 'Staff', value: 'staff' },
        { label: 'Volunteer', value: 'volunteer' },
      ],
    },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Display order (lower numbers first)' } },
  ],
}
