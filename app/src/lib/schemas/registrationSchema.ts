import { z } from "zod";
import validator from "validator";
import { Allergy } from "$models/allergy.model";

export const registrationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().refine(validator.isMobilePhone),
  firm: z.string().min(2),
  allergies: z.array(z.nativeEnum(Allergy)),
});
