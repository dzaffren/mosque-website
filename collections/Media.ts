import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Sanitize filename strictly before S3 sees it
        if (req.file) {
          const cleanName = req.file.name
            .replace(/[^a-zA-Z0-9.]/g, '-') // Replace non-alphanumeric chars with hyphens
            .toLowerCase();
          
          req.file.name = cleanName;
          data.filename = cleanName; // Explicitly update the data object too
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
    },
  ],
}