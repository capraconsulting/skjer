export const Allergy = {
  1: "Gluten",
  2: "Sesamfrø",
  3: "Nøtter",
  4: "Skalldyr",
  5: "Egg",
  6: "Fisk",
  7: "Sennep",
  8: "Melk",
  9: "Selleri",
  10: "Peanøtter",
  11: "Soya",
  12: "Bløtdyr",
  13: "Lupin",
  14: "Svoveldioksyd/sulfitter",
} as const;

export type AllergyEnum = (typeof Allergy)[keyof typeof Allergy];

export const AllergyItems = Object.entries(Allergy).map(([key, value]) => ({
  value: parseInt(key),
  name: value,
}));
