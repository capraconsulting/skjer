import validator from "validator";
import { z } from "zod";

export const registrationSchemaInternal = z.object({
  foodPreference: z
    .string()
    .max(500)
    .transform((input) => (input ? validator.escape(input) : null))
    .nullable(),
  attendingType: z.enum(["Fysisk", "Digitalt"]).transform(validator.escape).default("Fysisk"),
  customOptions: z.array(
    z.object({
      option: z.string().max(500).transform(validator.escape),
      value: z.string().max(500).transform(validator.escape),
    })
  ),
});

export const unregistrationSchemaInternal = z.object({});

export type RegistrationFormInternalType = z.infer<typeof registrationSchemaInternal>;
export type UnregistrationFormInternalType = z.infer<typeof unregistrationSchemaInternal>;
