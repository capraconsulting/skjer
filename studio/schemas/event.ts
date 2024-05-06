import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  description: 'Et arrangement',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'En kort beskrivelse av arrangementet, 2-3 setninger.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'start',
      title: 'Start date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'End date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'maxParticipant',
      title: 'Max participant',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'category',
    }),
    defineField({
      name: 'place',
      title: 'Place',
      type: 'text',
    }),
    defineField({
      title: 'Ask about allergy?',
      name: 'allergy',
      type: 'boolean',
    }),
    defineField({
      title: 'Add custom fields?',
      name: 'fields',
      type: 'boolean',
    }),
    // Conditional fields for custom preferences
    defineField({
      name: 'customFields',
      title: 'Custom fields',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({document}) => !document?.fields,
    }),
  ],
  orderings: [
    {
      title: 'Event name',
      name: 'eventNameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Event date',
      name: 'eventDateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      start: 'start',
      category: 'category.name',
      media: 'mainImage',
    },
  },
})
