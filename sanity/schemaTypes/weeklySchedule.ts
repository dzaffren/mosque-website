import { defineField, defineType } from 'sanity'

// Helper function to create a prayer assignment object
const prayerAssignment = (name: string, title: string) => ({
  name,
  title,
  type: 'object',
  fields: [
    { name: 'imam', title: 'Imam', type: 'string' },
    { name: 'bilal', title: 'Bilal', type: 'string' },
  ]
})

// Helper to create a day with all 5 prayers
const dayFields = (dayName: string) => ({
  name: dayName.toLowerCase(),
  title: dayName,
  type: 'object',
  fields: [
    prayerAssignment('fajr', 'Fajr'),
    prayerAssignment('dhuhr', 'Dhuhr'),
    prayerAssignment('asr', 'Asr'),
    prayerAssignment('maghrib', 'Maghrib'),
    prayerAssignment('isha', 'Isha'),
  ]
})

export default defineType({
  name: 'weeklySchedule',
  title: 'Weekly Roster',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Week Title', type: 'string', initialValue: 'Current Week' }),
    dayFields('Monday'),
    dayFields('Tuesday'),
    dayFields('Wednesday'),
    dayFields('Thursday'),
    dayFields('Friday'),
    dayFields('Saturday'),
    dayFields('Sunday'),
  ],
})