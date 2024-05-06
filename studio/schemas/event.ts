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
      description: 'Den delen av URLen som identifiserer dette arrangementet.',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'summary',
      title: 'Oppsummering',
      type: 'text',
      description: 'En kort beskrivelse av arrangementet, 2-3 setninger.',
    }),
    defineField({
      name: 'start',
      title: 'Startddato',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'end',
      title: 'Sluttdato',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Informasjon',
      type: 'blockContent',
      description: 'Skriv en tekst som beskriver arrangementet i detalj.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Bilde',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'maxParticipant',
      title: 'Maks antall deltagere',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'category',
    }),
    defineField({
      name: 'place',
      title: 'Sted',
      type: 'text',
    }),
    defineField({
      title: 'Spør om allergier?',
      name: 'allergy',
      type: 'boolean',
    }),
    defineField({
      title: 'Legg til egne felter?',
      name: 'fields',
      type: 'boolean',
    }),
    // Conditional fields for custom preferences
    defineField({
      name: 'customFields',
      title: 'Egne felter',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({document}) => !document?.fields,
    }),
  ],
  orderings: [
    {
      title: 'Navn',
      name: 'eventNameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
    {
      title: 'Dato',
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
