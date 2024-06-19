import { defineField } from "sanity";

/**
 * This schema field is not in use per today's date. Probably requires rrule on the client.
 * Sanity plugin <Recurring Dates Input> was also considered, but did not support local language.
 */
export const recurrence = defineField({
  name: "recurrence",
  title: "Gjentagende arrangement?",
  type: "object",
  options: { columns: 1 },
  fields: [
    defineField({
      name: "frequency",
      title: "Frekevens",
      description:
        "Velg hvor ofte arragenementet skal gjentas: daglig, ukentlig, månedlig eller årlig.",
      type: "string",
      options: {
        list: [
          { title: "Daglig", value: "DAILY" },
          { title: "Ukentlig", value: "WEEKLY" },
          { title: "Månedelig", value: "MONTHLY" },
          { title: "Årlig", value: "YEARLY" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "interval",
      title: "Intervall",
      description: "Antall frekvensenheter mellom hver hendelse (f.eks. hver 2. uke).",
      type: "number",
      validation: (Rule) => Rule.required().min(1).integer(),
    }),
  ],
});
