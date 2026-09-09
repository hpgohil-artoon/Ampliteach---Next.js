import { z } from "zod";

/**
 * The 7-field homepage trial signup form.
 *
 * `studentCount` is validated as a digit string rather than a coerced number:
 * an <input> always yields a string, and coercion makes the resolver's input
 * and output types diverge, which react-hook-form then rejects. The receiving
 * endpoint parses it.
 */
export const trialSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  companyName: z.string().min(2, "Please enter your school or company name."),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number.")
    .regex(/^[\d\s()+.-]+$/, "Please enter a valid phone number."),
  websiteUrl: z
    .string()
    .url("Please enter a full URL, including https://")
    .optional()
    .or(z.literal("")),
  studentCount: z
    .string()
    .min(1, "Please enter the number of students.")
    .regex(/^\d+$/, "Please enter a whole number.")
    .refine((value) => Number(value) >= 1, "Please enter at least 1 student.")
    .refine((value) => Number(value) <= 100000, "Please enter a realistic student count."),
  email: z.string().email("Please enter a valid email address."),
});

export type TrialInput = z.infer<typeof trialSchema>;
