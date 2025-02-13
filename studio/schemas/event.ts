import { CheckmarkIcon, CircleIcon, TextIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";
import { EventInfo } from "../components/EventInfo";

export default defineType({
  name: "event",
  title: "Arrangement",
  type: "document",
  fieldsets: [
    {
      title: "Gjentakelse innstillinger",
      name: "recurrence",
      options: { columns: 2 },
      group: "recurrence",
    },
  ],
  readOnly: ({ document }) => {
    if (!document?.cancelId) {
      return false;
    }
    if (document?._id.endsWith(document.cancelId as string)) {
      return true;
    }
    return false;
  },
  fields: [
    defineField({
      name: "metaInfo",
      type: "string",
      components: {
        field: EventInfo,
      },
      readOnly: true,
    }),
    defineField({
      name: "cancelId",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "title",
      title: "Tittel på arrangementet",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "start",
      title: "Startddato og tid",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "Sluttdato og tid",
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
      name: "place",
      title: "Sted",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Ingress til arrangementet",
      type: "text",
      rows: 4,
      description:
        "Kort tekst som kommer rett etter tittel på arrangementet. 2-3 settninger holder.",
      placeholder:
        'Eks. "Capra, Fryde og Liflig inviterer til en god start på dagen. Kom på frokostseminar 12. juni kl.08:00"',
    }),
    defineField({
      name: "image",
      title: "Bilde til arrangementet (valgfritt)",
      type: "image",
      description: 'Du finner bibliotek med allerede lagt til bilder under "velg"',
      options: {
        hotspot: true,
        metadata: ["palette"],
      },
    }),
    defineField({
      name: "body",
      title: "Detaljert info om arrangementet",
      type: "blockContent",
      description:
        "Her kan du skrive mer detaljer om arrangementet, men prøv å hold det kort likevel. Inkluder gjerne program og alt annet deltakerne trenger å vite.",
    }),
    defineField({
      name: "category",
      title: "Arrangementskategori",
      type: "category",
    }),
    defineField({
      name: "organisers",
      title: "Hvilke(t) selskap er arrangør?",
      type: "string",
      options: {
        list: ["Alle", "Capra", "Fryde", "Liflig"],
      },
      initialValue: "Alle",
      validation: (Rule) => Rule.required(),
      readOnly: ({ document }) => !document?._id.startsWith("drafts."),
    }),
    defineField({
      name: "maxParticipant",
      title: "Maks antall deltagere",
      description: "Dersom det ikke er noe maksantall lar du denne stå tom.",
      type: "number",
    }),
    defineField({
      name: "isRecurring",
      title: "Arrangementet skal gjentas",
      description:
        "Kryss av her dersom arrangementet skal gjentas for eksempel hver andre uke eller månedlig.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "interval",
      title: "Hvor ofte skal det gjentas?",
      type: "number",
      initialValue: 1,
      options: {
        list: [
          { title: "Hver", value: 1 },
          { title: "Hver andre", value: 2 },
          { title: "Hver tredje", value: 3 },
          { title: "Hver fjerde", value: 4 },
          { title: "Hver femte", value: 5 },
          { title: "Hver sjette", value: 6 },
          { title: "Hver syvende", value: 7 },
        ],
      },
      hidden: ({ document }) => !document?.isRecurring,
      validation: (Rule) => Rule.required(),
      fieldset: "recurrence",
    }),
    defineField({
      title: " ",
      name: "frequence",
      type: "string",
      initialValue: "day",
      options: {
        list: [
          { title: "Dag", value: "day" },
          { title: "Uke", value: "week" },
          { title: "Måned", value: "month" },
          { title: "År", value: "year" },
        ],
      },
      hidden: ({ document }) => !document?.isRecurring,
      validation: (Rule) => Rule.required(),
      fieldset: "recurrence",
    }),
    defineField({
      name: "isDigital",
      title: "Arrangementet skal strømmes",
      description:
        "Kryss av her dersom arrangementet skal strømmes, du må også huske å planlegge for dette.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Lenke til hvor arrangementet skal strømmes",
      name: "linkStreaming",
      type: "string",
      description: "Link til møterom i meet?",
      hidden: ({ document }) => !document?.isDigital,
    }),
    defineField({
      name: "openForExternals",
      title: "Eksterne kan delta på arrangementet",
      description: "Kryss av her dersom eksterne også kan delta på arrangementet.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visibleForExternals",
      title: "Arrangementet skal være synlig for alle, også eksterne",
      description:
        "Dersom arrangementet KUN skal være synlig for de som er logget inn med Fryde-, Capra- eller Liflig-epost, lar du denne stå tom.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Arrangementet skal ha matservering",
      name: "foodPreference",
      description:
        "Kryss av her dersom det serveres mat, slik at deltagere kan legge inn allergier og matpreferanser.",
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
      description: "Du kan også velge å fylle inn hvor det skal spises eller hva som serveres.",
      hidden: ({ document }) => !document?.foodPreference,
    }),
    defineField({
      name: "foodDeadline",
      title: "Matpåmeldingsfrist",
      type: "datetime",
      validation: (Rule) => Rule.max(Rule.valueOfField("deadline")),
      description: "Du kan også velge å legge til en påmeldingsfrist for maten.",
      hidden: ({ document }) => !document?.foodPreference,
    }),
    defineField({
      name: "customOptions",
      title: "Legg til egendefinerte spørsmål",
      description:
        "Her kan du legge til andre spørsmål, slik som hvor personen så arrangementet, om den skal ha med seg noen, motivasjon til å delta osv.",
      type: "array",
      of: [
        {
          title: "Skriv ditt spørsmål",
          type: "object",
          options: { columns: 1 },
          fields: [
            defineField({
              name: "fieldOption",
              title: "Spørsmål",
              type: "string",
              description:
                "Skriv inn spørsmålet ditt her. Eksempel: “Hvor så du arrangementet?”, “Skal du ha med deg noen?”, “Ønsker du å leie eller har du badebukser når du skal bade og ta badstue?”.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              title: "Svaralternativ",
              name: "fieldValueCheckbox",
              type: "string",
              description:
                "Skriv inn svaralternativet ditt her. Eksempel: “Ja, jeg ønsker å leie badebukse“",
              hidden: ({ parent }) => parent?.fieldType !== "checkbox",
            }),
            defineField({
              title: "Svaralternativer",
              name: "fieldValueRadio",
              type: "array",
              of: [{ type: "string" }],
              description: "Skriv inn de to svaralternativene dine her. Eksempel: “Ja” og “Nei”",
              validation: (Rule) => Rule.min(2).max(2),
              hidden: ({ parent }) => parent?.fieldType !== "radio",
            }),
            defineField({
              name: "fieldType",
              title: "Velg input-type",
              type: "string",
              options: {
                list: [
                  { title: "Radioknapper", value: "radio" },
                  { title: "Avkrysningsboks", value: "checkbox" },
                  { title: "Tekstfelt", value: "input" },
                ],
                layout: "radio",
              },
              initialValue: "radio",
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
                media:
                  subtitle === "radio"
                    ? CircleIcon
                    : subtitle === "checkbox"
                      ? CheckmarkIcon
                      : TextIcon,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "emailTemplate",
      title: "E-post maler",
      type: "emailTemplate",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
