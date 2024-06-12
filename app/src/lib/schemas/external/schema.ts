import { z } from "zod";
import validator from "validator";

export const registrationSchemaExternal = z.object({
  subject: z.null(), // Honeypot
  fullName: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().refine(validator.isMobilePhone).nullable(),
  firm: z.string().min(2).nullable(),
  allergies: z.array(z.number()),
  attendingType: z.enum(["Fysisk", "Digitalt"]).default("Fysisk"),
  customOptions: z.array(z.string()),
});

export const unregistrationSchemaExternal = z.object({
  subject: z.null(), // Honeypot
  email: z.string().email(),
});
