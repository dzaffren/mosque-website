import type { CollectionConfig } from 'payload'

const prayerFields = (prayer: string) => ({
  name: prayer,
  type: 'group' as const,
  fields: [
    { name: 'imam', type: 'text' as const },
    { name: 'bilal', type: 'text' as const },
  ],
})

export const PrayerRoster: CollectionConfig = {
  slug: 'prayer-roster',
  labels: { singular: 'Prayer Roster', plural: 'Prayer Roster' },
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      unique: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    prayerFields('fajr'),
    prayerFields('dhuhr'),
    prayerFields('asr'),
    prayerFields('maghrib'),
    prayerFields('isha'),
  ],
}
