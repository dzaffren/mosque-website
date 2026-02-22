import { createClient } from '@supabase/supabase-js'
import type { CollectionAfterChangeHook, CollectionBeforeDeleteHook } from 'payload'
import { promises as fs } from 'fs'
import path from 'path'

const supabase = process.env.SUPABASE_URL
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
    )
  : null

const BUCKET_NAME = 'media'

/**
 * Upload file to Supabase Storage after local save
 */
export const uploadToSupabase: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only upload on create in production
  if (!supabase || process.env.NODE_ENV !== 'production' || operation !== 'create') {
    return doc
  }

  try {
    if (!doc?.filename) {
      return doc
    }

    // Generate unique path: year/month/filename
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const storagePath = `${year}/${month}/${doc.id}-${doc.filename}`

    // Try to read file from /tmp/media (temporary storage)
    const tmpPath = path.join('/tmp/media', doc.filename)
    let fileBuffer: Buffer | undefined

    try {
      fileBuffer = await fs.readFile(tmpPath)
    } catch {
      // If file not in /tmp, try from request file data
      if (req.file?.data) {
        fileBuffer = req.file.data as Buffer
      }
    }

    if (fileBuffer) {
      // Upload to Supabase
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: doc.mimeType || 'application/octet-stream',
          upsert: true,
        })

      if (error) {
        console.error('Supabase upload error:', error)
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath)

      if (urlData?.publicUrl) {
        // Update the document in database with the public URL
        await req.payload.update({
          collection: 'media',
          id: doc.id,
          data: {
            url: urlData.publicUrl,
          },
          req,
        })
        
        // Also update the returned doc object
        doc.url = urlData.publicUrl
      }
    }
  } catch (error) {
    console.error('Failed to upload to Supabase Storage:', error)
  }

  return doc
}

/**
 * Delete file from Supabase Storage before deletion
 */
export const deleteFromSupabase: CollectionBeforeDeleteHook = async ({
  req,
  id,
}) => {
  if (!supabase || process.env.NODE_ENV !== 'production') {
    return
  }

  try {
    const doc = await req.payload.findByID({
      collection: 'media',
      id,
      req,
    })

    if (!doc?.url) return

    // Extract path from public URL
    const urlParts = doc.url.split('/media/')
    if (urlParts.length > 1) {
      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (error) {
        console.error('Supabase delete error:', error)
      }
    }
  } catch (error) {
    console.error('Failed to delete from Supabase Storage:', error)
  }
}
