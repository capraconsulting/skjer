import { defineType } from "sanity";

const categories = [
  { value: "Sosialt", title: "Sosialt" },
  { value: "Fag", title: "Fag" },
];

export default defineType({
  name: "category",
  title: "Kategory",
  type: "string",
  options: {
    list: categories,
  },
});
