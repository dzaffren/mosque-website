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
  ],
  upload: {
    disableLocalStorage: isProduction,
    ...(!isProduction && {
      staticDir: path.resolve(dirname, '../../media'),
    }),
  },
  hooks: {
    afterChange: [uploadToSupabase],
    beforeDelete: [deleteFromSupabase],
  },
}
