import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PrayerTimes } from './collections/PrayerTimes'
import { Events } from './collections/Events'
import { Announcements } from './collections/Announcements'
import { Gallery } from './collections/Gallery'
import { Staff } from './collections/Staff'
import { KhutbahSchedule } from './collections/KhutbahSchedule'
import { PrayerRoster } from './collections/PrayerRoster'
import { Donations } from './collections/Donations'
import { Pledges } from './collections/Pledges'
import { ContactMessages } from './collections/ContactMessages'
import { MosqueSettings } from './globals/MosqueSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Select database adapter based on environment
const isProduction = process.env.NODE_ENV === 'production'
const dbAdapter = isProduction
  ? postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URL || '',
        max: 3,
        connectionTimeoutMillis: 60_000,
        idleTimeoutMillis: 30_000,
        ssl: { rejectUnauthorized: false },
      },
    })
  : sqliteAdapter({
      client: {
        url: process.env.DATABASE_URL || 'file:./mosque.db',
      },
    })

// Only add S3 storage plugin in production (Supabase S3-compatible storage)
const plugins = isProduction && process.env.S3_ENDPOINT
  ? [
      s3Storage({
        collections: {
          media: true,
        },
        bucket: process.env.S3_BUCKET || 'media',
        acl: 'public-read',
        config: {
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
          },
          region: process.env.S3_REGION || 'us-east-1',
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: true,
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, PrayerTimes, Events, Announcements, Gallery, Staff, KhutbahSchedule, PrayerRoster, Donations, Pledges, ContactMessages],
  globals: [MosqueSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: dbAdapter,
  sharp,
  plugins,
})
