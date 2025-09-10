import { z } from "zod";
import validator from "validator";
import { validateDomain } from "$lib/utils/domain";
export const registrationSchemaExternal = z.object({
  subject: z.null(), // Honeypot
  fullName: z.string().min(2).max(150).transform(validator.escape),
  email: z
    .string()
    .max(150, { message: "E-post kan ikke være lengre enn 150 tegn" })
    .refine((email) => email.length > 0, { message: "E-post er påkrevd" })
    .refine((email) => validator.isEmail(email), { message: "E-post må være gyldig" })
    .refine((email) => !validateDomain(email), {
      message: "Logg deg inn for å melde deg på arrangementet!",
    }),
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
