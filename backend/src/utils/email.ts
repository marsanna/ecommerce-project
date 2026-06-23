import { RESEND_API_KEY, RESEND_SENDER_EMAIL } from "#config";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

type SendEmail = {
  to: string;
  subject: string;
  text: string;
};

export const sendEmail = async ({ to, subject, text }: SendEmail) => {
  await resend.emails.send({
    from: `My Shop <${RESEND_SENDER_EMAIL}>`,
    to,
    subject,
    text,
  });
};
