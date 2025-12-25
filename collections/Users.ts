import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  access: {
    // 1. Only YOU (Dev) or Super Admin can create users
    create: ({ req: { user } }) => 
      ['dev', 'super-admin'].includes(user?.role),
    
    // 2. Control who can update who
    update: ({ req: { user }, id }) => {
      if (user?.role === 'dev') return true; // Dev can update anyone
      if (user?.role === 'super-admin') {
        // Super admin can't update a Dev account
        // We'll need a way to identify the dev account (usually by ID or Role)
        return {
          role: { not_equals: 'dev' }
        }
      }
      return user?.id === id; // Normal admin/editor can only update self
    },

    // 3. Control who can delete who
    delete: ({ req: { user } }) => {
      if (user?.role === 'dev') return true;
      if (user?.role === 'super-admin') {
        // Super Admin can delete anyone EXCEPT a Dev
        return {
          role: { not_equals: 'dev' }
        }
      }
      return false;
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Developer (Maintenance)', value: 'dev' },
        { label: 'Super Admin (User Manager)', value: 'super-admin' },
        { label: 'Admin (Content Manager)', value: 'admin' },
      ],
      access: {
        // Only Dev can set or change a role to 'dev'
        update: ({ req: { user } }) => user?.role === 'dev',
      },
    },
  ],
}