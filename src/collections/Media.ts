import type { CollectionConfig } from 'payload'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadToSupabase, deleteFromSupabase } from '../hooks/supabaseStorage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Ensure media directory exists with recursive option (dev only)
const ensureMediaDir = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const mediaDir = path.resolve(dirname, '../../media')
    try {
      await fs.mkdir(mediaDir, { recursive: true })
    } catch (error) {
      // Ignore errors, directory may already exist
    }
  }
}

// Call on import
ensureMediaDir().catch(console.error)

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
  upload: process.env.NODE_ENV === 'production'
    ? false // Disable local storage in production, use Supabase only
    : {
        staticDir: path.resolve(dirname, '../../media'),
      },
  hooks: {
    afterChange: [uploadToSupabase],
    beforeDelete: [deleteFromSupabase],
  },
}
