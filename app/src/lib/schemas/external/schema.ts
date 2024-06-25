import { z } from "zod";
import validator from "validator";
import { validateDomain } from "$lib/utils/domain";
export const registrationSchemaExternal = z.object({
  subject: z.null(), // Honeypot
  fullName: z.string().min(2).max(150).transform(validator.escape),
  email: z
    .string()
    .email()
    .max(150)
    .refine((email) => !validateDomain(email)),
  telephone: z.string().max(20).refine(validator.isMobilePhone).nullable(),
  firm: z.string().min(2).max(100).transform(validator.escape).nullable(),
  foodPreference: z.string().max(500).transform(validator.escape).nullable(),
  attendingType: z.enum(["Fysisk", "Digitalt"]).transform(validator.escape).default("Fysisk"),
  customOptions: z.array(
    z.object({
      option: z.string().max(500).transform(validator.escape),
      value: z.string().max(500).transform(validator.escape),
    })
  ),
});

export const unregistrationSchemaExternal = z.object({
  subject: z.null(), // Honeypot
  email: z.string().email().max(150),
});

export type RegistrationFormExternalType = z.infer<typeof registrationSchemaExternal>;
export type UnregistrationFormExternalType = z.infer<typeof unregistrationSchemaExternal>;
