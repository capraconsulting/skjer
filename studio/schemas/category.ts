import { defineType } from "sanity";

const categories = [
  { value: "Sosialt", title: "Sosialt" },
  { value: "Frokostseminar", title: "Frokostseminar" },
  { value: "Konferanse", title: "Konferanse" },
  { value: "Fagsamling", title: "Fagsamling" },
  { value: "Fagsirkel", title: "Fagsirkel" },
];

export default defineType({
  name: "category",
  title: "Category",
  type: "string",
  options: {
    list: categories,
  },
});
