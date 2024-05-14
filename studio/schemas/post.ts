import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/-/g, " ")
            .replace(/æ/g, "ae")
            .replace(/ø/g, "oe")
            .replace(/å/g, "aa")
            .replace(/[^a-z\s]/g, "")
            .replace(/\s+/g, "-")
            .trim()
            .slice(0, 200),
      },
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "publishedAt",
      title: "Publication Date",
      type: "datetime",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "code",
          title: "Code",
          name: "code",
          options: {
            languageAlternatives: [
              { title: "batch", value: "batch" },
              { title: "csharp", value: "csharp" },
              { title: "css", value: "css" },
              { title: "groq", value: "groq" },
              { title: "golang", value: "golang" },
              { title: "html", value: "html" },
              { title: "java", value: "java" },
              { title: "javascript", value: "javascript" },
              { title: "jsx", value: "jsx" },
              { title: "markdown", value: "markdown" },
              { title: "mysql", value: "mysql" },
              { title: "php", value: "php" },
              { title: "python", value: "python" },
              { title: "ruby", value: "ruby" },
              { title: "sass", value: "sass" },
              { title: "scss", value: "scss" },
              { title: "sh", value: "sh" },
              { title: "sql", value: "sql" },
              { title: "text", value: "text" },
              { title: "tsx", value: "tsx" },
              { title: "typescript", value: "typescript" },
              { title: "vue", value: "vue" },
              { title: "xml", value: "xml" },
              { title: "yaml", value: "yaml" },
              { title: "json", value: "json" },
            ],
          },
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          fields: [
            {
              type: "string",
              name: "alt",
              title: "Alt",
            },
          ],
        },
      ],
    }),
  ],
});
