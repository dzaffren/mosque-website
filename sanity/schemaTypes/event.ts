import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Community', value: 'Community' },
          { title: 'Education', value: 'Education' },
          { title: 'Competition', value: 'Competition' },
          { title: 'Workshop', value: 'Workshop' },
        ],
      },
      initialValue: 'Community'
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string', 
      description: 'e.g. 6:30 PM'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Main Prayer Hall',
    }),
    defineField({
      name: 'attendees',
      title: 'Expected Attendees',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text', 
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})