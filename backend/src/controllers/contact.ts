import { CONTACT_RECEIVER_EMAIL, TURNSTILE_SECRET_KEY } from "#config";
import { contactSchema } from "#schemas";
import { type RequestHandler } from "express";
import { z } from "zod/v4";

import { sendEmail } from "../utils/email.ts";

interface TurnstileResult {
  success: boolean;
  "error-codes"?: string[];
}

export type contactDTO = z.infer<typeof contactSchema>;

export const sendContactEmail: RequestHandler<
  {},
  { success: boolean } | { message: string },
  contactDTO
> = async (req, res, next): Promise<void> => {
  try {
    if (!TURNSTILE_SECRET_KEY) {
      console.error("TURNSTILE_SECRET_KEY is not defined.");
      res.status(500).json({
        message: "Contact form is unavailable. Please try again.",
      });
      return;
    }

    if (!CONTACT_RECEIVER_EMAIL) {
      console.error("CONTACT_RECEIVER_EMAIL is not defined.");
      res.status(500).json({
        message: "Contact form is unavailable. Please try again.",
      });
      return;
    }

    const { name, email, subject, message, turnstileToken } =
      req.body as contactDTO;

    const verifyUrl =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const turnstileResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        response: turnstileToken || "",
        secret: TURNSTILE_SECRET_KEY || "",
      }),
    });

    const outcome = (await turnstileResponse.json()) as TurnstileResult;

    if (!outcome.success) {
      console.error("Turnstile verification failed", outcome["error-codes"]);
      res.status(400).json({
        message: "Security check failed. Please try again.",
      });
      return;
    }

    const textMessage = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;

    try {
      await sendEmail({
        to: CONTACT_RECEIVER_EMAIL,
        subject: `Ecommerce - ${subject}`,
        text: textMessage,
      });
    } catch (error) {
      console.error("Failed to send email", error);
      res.status(500).json({
        message: "Failed to send email. Please try again.",
      });
      return;
    }
    res.status(200).json({ success: true });
    return;
  } catch (error) {
    console.error("An unexpected error occurred", error);
    next(error);
  }
};
