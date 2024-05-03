import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  description: 'An event',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'A short summary of the event, no more than 2 or 3 sentences',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      description: 'A full description of the event',
      validation: (Rule) => Rule.required(),
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
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'An image relevant to the event',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      description: 'This can be used to identify the event in a URL',
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
      media: 'image',
    },
  },
})
