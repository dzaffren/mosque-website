import { createClient } from '@supabase/supabase-js'
import type { CollectionBeforeChangeHook, CollectionBeforeDeleteHook } from 'payload'

const supabase = process.env.SUPABASE_URL
  ? createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
    )
  : null

const BUCKET_NAME = 'media'

/**
 * Upload file to Supabase Storage before save
 */
export const uploadToSupabase: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // Only upload in production on create
  if (!supabase || process.env.NODE_ENV !== 'production' || operation !== 'create') {
    return data
  }

  try {
    // Get file from request
    const file = req.file
    if (!file?.data || !file?.name) {
      console.log('No file data found in request')
      return data
    }

    // Generate unique path: year/month/filename
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const filename = file.name
    const storagePath = `${year}/${month}/${Date.now()}-${filename}`

    console.log('Uploading to Supabase:', storagePath)

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file.data, {
        contentType: file.mimetype || 'application/octet-stream',
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
      console.log('File uploaded successfully:', urlData.publicUrl)
      // Override the URL in the data before it's saved
      data.url = urlData.publicUrl
    }
  } catch (error) {
    console.error('Failed to upload to Supabase Storage:', error)
  }

  return data
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
