import type { CollectionConfig, Field, FieldHook } from 'payload'

const formatTitle: FieldHook = async ({ data }) => {
  if (data?.startDate) {
    const date = new Date(data.startDate)
    return `Week of ${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`
  }
  return 'Untitled Schedule'
}

const createDayField = (day: string): Field => {
  const isFriday = day === 'friday'
  return {
    name: day,
    label: day.charAt(0).toUpperCase() + day.slice(1), 
    type: 'group',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'fajr',
            type: 'group',
            label: 'Fajr',
            fields: [
              { name: 'imam', type: 'text', label: 'Imam' },
              { name: 'bilal', type: 'text', label: 'Bilal' },
            ],
            admin: { width: '20%' },
          },
          {
            name: 'dhuhr',
            type: 'group',
            label: isFriday ? 'Jumuah' : 'Dhuhr', 
            fields: [
              { name: 'imam', type: 'text', label: isFriday ? 'Khatib / Imam' : 'Imam' },
              { name: 'bilal', type: 'text', label: 'Bilal' },
            ],
            admin: { width: '20%' },
          },
          {
            name: 'asr',
            type: 'group',
            label: 'Asr',
            fields: [
              { name: 'imam', type: 'text', label: 'Imam' },
              { name: 'bilal', type: 'text', label: 'Bilal' },
            ],
            admin: { width: '20%' },
          },
          {
            name: 'maghrib',
            type: 'group',
            label: 'Maghrib',
            fields: [
              { name: 'imam', type: 'text', label: 'Imam' },
              { name: 'bilal', type: 'text', label: 'Bilal' },
            ],
            admin: { width: '20%' },
          },
          {
            name: 'isha',
            type: 'group',
            label: 'Isha',
            fields: [
              { name: 'imam', type: 'text', label: 'Imam' },
              { name: 'bilal', type: 'text', label: 'Bilal' },
            ],
            admin: { width: '20%' },
          },
        ],
      },
    ],
  }
}

export const WeeklySchedule: CollectionConfig = {
  slug: 'weekly-schedules',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'updatedAt'],
  },
  // 👇 RBAC Logic Applied
  access: {
    // Dev and Super Admin can delete; Normal Admin can only create/update
    delete: ({ req: { user } }) => 
      ['dev', 'super-admin'].includes(user?.role),
    create: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    update: ({ req: { user } }) => 
      ['dev', 'super-admin', 'admin'].includes(user?.role),
    read: () => true, // Public can view schedules
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [formatTitle],
      },
    },
    {
      name: 'startDate',
      label: 'Week Starting Date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    createDayField('monday'),
    createDayField('tuesday'),
    createDayField('wednesday'),
    createDayField('thursday'),
    createDayField('friday'),
    createDayField('saturday'),
    createDayField('sunday'),
  ],
}