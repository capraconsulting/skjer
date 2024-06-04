import { defineType, defineField } from "sanity";

export default defineType({
  name: "event",
  title: "Arrangement",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Oppsummering",
      type: "string",
      description: "En kort beskrivelse av arrangementet, 2-3 setninger.",
    }),
    defineField({
      name: "start",
      title: "Startddato",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "Sluttdato",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Innhold",
      type: "blockContent",
      description: "Skriv en tekst som beskriver arrangementet i detalj.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "maxParticipant",
      title: "Maks antall deltagere",
      type: "number",
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "category",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "place",
      title: "Sted",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organisers",
      title: "I regi av",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: ["Capra", "Fryde", "Liflig"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Spør om allergier?",
      name: "allergy",
      type: "boolean",
    }),
    defineField({
      title: "Legg til egne felter?",
      name: "fields",
      type: "boolean",
    }),
    // Conditional fields for custom preferences
    defineField({
      name: "customFields",
      title: "Egne felter",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.fields,
    }),
  ],
  preview: {
    select: {
      title: "title",
      start: "start",
      category: "category.name",
      media: "image",
    },
  },
});
