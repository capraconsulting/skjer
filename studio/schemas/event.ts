import { CheckmarkIcon, TextIcon } from "@sanity/icons";
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
      validation: (Rule) => Rule.required().min(Rule.valueOfField("start")),
    }),
    defineField({
      name: "deadline",
      title: "Påmeldingsfrist",
      type: "datetime",
      validation: (Rule) => Rule.required().max(Rule.valueOfField("start")),
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
      name: "isDigital",
      title: "Digitalt",
      description: "Aktiver dette valget for å tillate digital deltagelse på arrangementet.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visibleForExternals",
      title: "Synlig for eksterne",
      description:
        "Hvis du krysser av på denne vil arrangementet være synlig for alle selv om man ikke er logget inn.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "openForExternals",
      title: "Åpen for eksterne",
      description:
        "Hvis du krysser av på denne vil det stå på arrangementet at det er åpent for alle. Hvis ikke står det at det kun er åpent for interne.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Allergier og matpreferanser",
      name: "foodPreference",
      description:
        "Dersom det skal serveres mat på arrangementet, kryss av på denne slik at allergier og matpreferanser blir lagt til i påmeldingsskjemaet.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Mat/restaurant",
      name: "food",
      type: "string",
      description:
        "Du kan også velge å fylle inn hvor det skal spises eller hva som serveres slik at det vises på arrangementet.",
      hidden: ({ document }) => !document?.foodPreference,
    }),
    defineField({
      name: "customOptions",
      title: "Egne felter",
      description: "Her kan du legge til andre felter/spørsmål enn de som er standard:",
      type: "array",
      of: [
        {
          type: "object",
          options: { columns: 1 },
          fields: [
            defineField({
              name: "fieldOption",
              title: "Label",
              type: "string",
              description: "Tekst som skal vises over feltet.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "fieldType",
              title: "Type felt",
              type: "string",
              options: {
                list: [
                  { title: "Avkrysningsboks", value: "checkbox" },
                  { title: "Tekstfelt", value: "input" },
                ],
                layout: "radio",
              },
              initialValue: "checkbox",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "fieldOption",
              subtitle: "fieldType",
              media: "",
            },
            prepare({ title, subtitle }) {
              return {
                title: title,
                media: subtitle === "checkbox" ? CheckmarkIcon : TextIcon,
              };
            },
          },
        },
      ],
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
