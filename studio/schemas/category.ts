import { defineType } from "sanity";

const categories = [
  { value: "Sosialt", title: "Sosialt" },
  { value: "Design", title: "Design" },
  { value: "Tech", title: "Tech" },
];

export default defineType({
  name: "category",
  title: "Category",
  type: "string",
  options: {
    list: categories,
  },
});
