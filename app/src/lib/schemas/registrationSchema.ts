import { z } from "zod";
import validator from "validator";

export const registrationSchema = z.object({
  subject: z.null(), // Honeypot
  fullName: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().refine(validator.isMobilePhone).nullable(),
  firm: z.string().min(2).nullable(),
  allergies: z.array(z.number()),
  attendingType: z.enum(["Fysisk", "Digitalt"]).default("Fysisk"),
  customOptions: z.array(z.string()),
});

export const unregistrationSchema = z.object({
  email: z.string().email(),
});
