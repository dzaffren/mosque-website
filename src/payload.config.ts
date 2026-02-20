import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
