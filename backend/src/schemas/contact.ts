import escapeHtml from "escape-html";
import { z } from "zod/v4";

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .transform((val) => escapeHtml(val)),
  email: z
    .string()
    .min(1, "Email is required")
    .trim()
    .regex(/^\S+@\S+\.\S+$/, "Email is not valid"),
  subject: z.enum(["general", "technical", "feedback"]),
  message: z
    .string()
    .min(1, "Message is required")
    .transform((val) => escapeHtml(val)),
  turnstileToken: z.string().min(1, "Verification token is required"),
});
