import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'news',
  title: 'News Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    // --- ADDED SLUG FIELD HERE ---
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title', // Automatically generates slug from the title
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    // ----------------------------
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Announcement', value: 'Announcement' },
          { title: 'Education', value: 'Education' },
          { title: 'Community', value: 'Community' },
          { title: 'Development', value: 'Development' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Mosque Admin',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio'
      },
      initialValue: 'published'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'A short summary for the card view.'
    }),
defineField({
  name: 'content',
  title: 'Content',
  type: 'array', 
  // Adding a description helps the UI reserve space and makes it easier to click
  description: 'Main article content. Click below to start writing.',
  of: [{ type: 'block' }] 
}),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})