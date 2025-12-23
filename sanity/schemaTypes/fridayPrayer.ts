import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'fridayPrayer',
  title: 'Friday Sermon Details',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Sermon Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // Note: 'imam' field is removed here because we get it from the Weekly Schedule
    defineField({
      name: 'summary',
      title: 'Sermon Summary',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'topics',
      title: 'Topics/Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'date',
    }),
  ],
})