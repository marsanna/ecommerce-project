import { z } from "zod/v4";

const emailError = "Please provide a valid email address.";
const emailSchema = z.email({ error: emailError }).trim();

export const contactSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: emailSchema,
  subject: z.enum(["general", "technical", "feedback"]),
  message: z.string().min(1, "Message is required"),
  turnstileToken: z
    .string({ message: "Verification token must be a string" })
    .min(1, "Verification token is required"),
});
