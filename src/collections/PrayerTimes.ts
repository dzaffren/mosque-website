import type { CollectionConfig } from 'payload'

export const PrayerTimes: CollectionConfig = {
  slug: 'prayer-times',
  labels: { singular: 'Prayer Time', plural: 'Prayer Times' },
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
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
    { name: 'fajr', type: 'text', required: true, defaultValue: '5:30 AM' },
    { name: 'dhuhr', type: 'text', required: true, defaultValue: '1:00 PM' },
    { name: 'asr', type: 'text', required: true, defaultValue: '4:30 PM' },
    { name: 'maghrib', type: 'text', required: true, defaultValue: '7:15 PM' },
    { name: 'isha', type: 'text', required: true, defaultValue: '8:30 PM' },
    { name: 'jumuah', type: 'text', defaultValue: '1:00 PM' },
  ],
}
