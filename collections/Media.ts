import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  // 👇 RBAC Logic Applied
  access: {
    // Dev and Super Admin can delete; Normal Admin can only upload/edit
    delete: ({ req: { user } }) => 
      ['dev', 'super-admin'].includes(user?.role),
    create: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    update: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    read: () => true, // Images must be public to show on the website
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Sanitize filename strictly before S3/Storage sees it
        if (req.file) {
          const cleanName = req.file.name
            .replace(/[^a-zA-Z0-9.]/g, '-')
            .toLowerCase();
          
          req.file.name = cleanName;
          data.filename = cleanName;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text (For SEO & Accessibility)',
    },
  ],
}