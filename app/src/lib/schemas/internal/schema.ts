import { z } from "zod";

export const registrationSchemaInternal = z.object({
  allergies: z.array(z.number()),
  attendingType: z.enum(["Fysisk", "Digitalt"]).default("Fysisk"),
  customOptions: z.array(z.string()),
});

export const unregistrationSchemaInternal = z.object({});
