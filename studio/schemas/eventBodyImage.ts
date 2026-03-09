import { defineField, defineType } from "sanity";

export default defineType({
  name: "eventBodyImage",
  title: "Bilde i arrangementsbeskrivelse",
  type: "object",
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
      name: "alt",
      title: "Alternativ tekst",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Bildetekst",
      type: "string",
    }),
    defineField({
      name: "placement",
      title: "Plassering",
      type: "string",
      initialValue: "full",
      options: {
        layout: "radio",
        list: [
          { title: "Full bredde", value: "full" },
          { title: "Flyt til venstre", value: "left" },
          { title: "Flyt til høyre", value: "right" },
          { title: "Midtstilt", value: "center" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      title: "Størrelse",
      type: "string",
      initialValue: "medium",
      options: {
        layout: "radio",
        list: [
          { title: "Liten", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Stor", value: "large" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
      placement: "placement",
      size: "size",
    },
    prepare({ title, media, placement, size }) {
      return {
        title: title || "Bilde i arrangementsbeskrivelse",
        subtitle: `${placement || "full"} • ${size || "medium"}`,
        media,
      };
    },
  },
});