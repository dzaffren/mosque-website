import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadToSupabase, deleteFromSupabase } from '../hooks/supabaseStorage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'purpose',
      type: 'select',
      defaultValue: 'other',
      options: [
        { label: 'Logo', value: 'logo' },
        { label: 'Gallery Image', value: 'gallery' },
        { label: 'Event Image', value: 'event' },
        { label: 'Staff Photo', value: 'staff' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Categorize this image for better organization',
      },
    },
  ],
  upload: {
    disableLocalStorage: isProduction,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 768,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    ...(!isProduction && {
      staticDir: path.resolve(dirname, '../../media'),
    }),
  },
  hooks: {
    beforeChange: [uploadToSupabase],
    beforeDelete: [deleteFromSupabase],
  },
}
