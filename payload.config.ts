import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

// Import your collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { WeeklySchedule } from './collections/WeeklySchedule'
import { FridayPrayer } from './collections/FridayPrayer'
import { Events } from './collections/Events'
import { News } from './collections/News'

// Import components
import { BackToSite } from './components/back-to-site'

import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: [
        // The "as any" casts it to silence the strict TypeScript warning
        BackToSite as any,
      ],
    }, 
  }, // 👈 THIS BRACKET WAS MISSING
  collections: [
    Users,
    Media,
    WeeklySchedule,
    Events,
    News,
    FridayPrayer
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        'media': true,
      },
      bucket: process.env.S3_BUCKET || '',
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
  ],
})