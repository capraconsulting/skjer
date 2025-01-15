import { uuid } from "@sanity/uuid";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "emailReminder",
  title: "E-post påminnelser",
  type: "object",
  options: { columns: 1, collapsed: true },
  fields: [
    defineField({
      name: "hasThreeDaysBefore",
      title: "3 dager før",
      type: "boolean",
      initialValue: true,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "threeDaysSubject",
      title: "Tilpass emne for 3 dager før",
      type: "string",
      initialValue: "Vi gleder oss til å se deg!",
      validation: (Rule) => Rule.required().min(3).max(100),
      hidden: ({ parent }) => !parent?.hasThreeDaysBefore,
    }),
    defineField({
      name: "threeDaysMessage",
      title: "Tilpass innhold for 3 dager før",
      type: "blockContent",
      initialValue: [
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Hei,",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "her kommer en vennlig påminnelse om at du har meldt deg på vårt arrangement. Vi gleder oss til å ta deg i mot.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Kan du ikke komme allikevel? Fort gjort! Du melder deg enkelt av samme sted du meldte deg på.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Har du spørsmål om arrangementet? Ta kontakt!",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "",
            },
          ],
          markDefs: [],
          style: "normal",
        },
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Vi ses!",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      hidden: ({ parent }) => !parent?.hasThreeDaysBefore,
    }),
    defineField({
      name: "hasOneHourBefore",
      title: "1 time før",
      type: "boolean",
      initialValue: true,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "oneHourSubject",
      title: "Tilpass emne for 1 time før",
      type: "string",
      initialValue: "Vi starter snart! Er du ute i siste liten?",
      validation: (Rule) => Rule.required().min(3).max(100),
      hidden: ({ parent }) => !parent?.hasOneHourBefore,
    }),
    defineField({
      name: "oneHourMessage",
      title: "Tilpass innhold for 1 time før",
      type: "blockContent",
      initialValue: [
        {
          _key: uuid(),
          _type: "block",
          children: [
            {
              _key: uuid(),
              _type: "span",
              marks: [],
              text: "Er trikken forsinket? Eller kanskje bare hverdagen er travel? Det er fort gjort å bli forsinket. Vi venter på deg og hjelper deg så du kan snike deg inn uten å tiltrekke deg særlig oppmerksomhet.",
            },
          ],
          markDefs: [],
          style: "normal",
        },
      ],
      hidden: ({ parent }) => !parent?.hasOneHourBefore,
    }),
  ],
});
