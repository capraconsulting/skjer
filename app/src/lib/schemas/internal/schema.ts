import { z } from "zod";

export const registrationSchemaInternal = z.object({
  foodPreference: z.string().nullable(),
  facilitation: z.string().nullable(),
  attendingType: z.enum(["Fysisk", "Digitalt"]).default("Fysisk"),
  customOptions: z.array(z.string()),
});

export const unregistrationSchemaInternal = z.object({});
