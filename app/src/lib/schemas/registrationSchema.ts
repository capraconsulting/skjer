import { z } from "zod";
import validator from "validator";

export const registrationSchema = z.object({
  subject: z.null(), // Honeypot
  fullName: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().refine(validator.isMobilePhone).nullable(),
  firm: z.string().min(2).nullable(),
  allergies: z.array(z.number()),
});
