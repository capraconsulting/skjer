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
      type: "text",
      rows: 4,
      description: "En kort beskrivelse av arrangementet, ca. 2-3 setninger",
    }),
    defineField({
      name: "start",
      title: "Startddato og tidspunkt",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "Sluttdato og tidspunkt",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Innhold",
      type: "blockContent",
      description:
        "Skriv en tekst som beskriver arrangementet i detalj, gjerne inkludert program og all relevant info.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "maxParticipant",
      title: "Maks antall deltagere",
      description:
        "Hvis det finnes en maksgrense for antall deltagere, fyll den inn her. Hvis ikke, la denne stå tom.",
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
      name: "onlyOpenForInternal",
      title: "Kun åpen for interne",
      description:
        "Hvis du krysser av å denne vil det stå på arrangementet at det er kun for interne. Hvis ikke står det at det er åpent for alle.",
      type: "boolean",
      options: {
        layout: "checkbox",
      },
    }),
    defineField({
      name: "onlyVisibleForInternal",
      title: "Kun synlig for interne",
      description:
        "Hvis du krysser av å denne vil arrangementet kun vises til interne som har logget seg inn på nettsiden. Hvis ikke vil det være synlig for alle.",
      type: "boolean",
      options: {
        layout: "checkbox",
      },
    }),
    defineField({
      title: "Matservering og allergier",
      name: "allergy",
      description:
        "Dersom det skal serveres mat på arrangementet, kryss av på denne slik at allergier blir lagt til i påmeldingsskjemaet.",
      type: "boolean",
      options: {
        layout: "checkbox",
      },
    }),
    defineField({
      title: "Mat/restaurant",
      name: "food",
      type: "string",
      description:
        "Du kan også velge å fylle inn hvor det skal spises eller hva som serveres slik at det vises på arrangementet.",
      hidden: ({ document }) => !document?.allergy,
    }),
    defineField({
      title: "Legg til egne felter",
      description:
        "Skru på denne hvis det er flere spørsmål du vil legge til i påmeldingsskjemaet, så dukker de opp under her.",
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
