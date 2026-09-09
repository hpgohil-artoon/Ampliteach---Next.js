import { z } from "zod";

/** Mirrors the live contact form: name, email, phone required; message optional. */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number.")
    .regex(/^[\d\s()+.-]+$/, "Please enter a valid phone number."),
  message: z.string().max(2000, "Please keep your message under 2000 characters.").optional(),
  /** Honeypot — bots fill it, humans never see it. Must stay empty. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
