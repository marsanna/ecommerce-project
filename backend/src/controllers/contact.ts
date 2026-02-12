import { contactSchema } from "#schemas";
import { type RequestHandler, type Response } from "express";
import { Resend } from "resend";
import { z } from "zod/v4";

interface TurnstileResult {
  success: boolean;
  "error-codes"?: string[];
}

export type contactDTO = z.infer<typeof contactSchema>;

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail: RequestHandler<
  {},
  { success: boolean } | { error: string },
  contactDTO
> = async (req, res, next): Promise<void> => {
  try {
    const { name, email, subject, message, turnstileToken } = req.body;

    const verifyUrl =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const turnstileResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || "",
        response: turnstileToken || "",
      }),
    });

    const outcome = (await turnstileResponse.json()) as TurnstileResult;

    if (!outcome.success) {
      console.error("Turnstile verification failed:", outcome["error-codes"]);
      res.status(400).json({
        success: false,
        error: "Security check failed. Please try again.",
      });
      return;
    }

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (!receiverEmail) {
      console.error(
        "Email sending failed: CONTACT_RECEIVER_EMAIL is not defined in environment variables.",
      );
      res.status(500).json({
        success: false,
        error: "Server configuration error. Please contact support.",
      });
      return;
    }

    const textMessage = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;

    const { data, error } = await resend.emails.send({
      from: "My Shop <onboarding@resend.dev>",
      to: receiverEmail,
      replyTo: email,
      subject: `My Shop - ${subject.toUpperCase()}`,
      text: textMessage,
      //html: `...`
    });
    if (error) {
      console.error("Resend API Error Details:", error);
      res.status(400).json({
        success: false,
        error:
          "Failed to send email. Please check the recipient address or try again later.",
      });
      return;
    }

    res.status(200).json({ success: true });
    return;
  } catch (error) {
    console.error("Email service error:", error);
    next(error);
  }
};
