import { CONTACT_RECEIVER_EMAIL, RESEND_API_KEY } from "#config";
import { Resend } from "resend";

console.log("Resend API Key:", RESEND_API_KEY);
console.log("Contact Receiver Email:", CONTACT_RECEIVER_EMAIL);
const resend = new Resend(RESEND_API_KEY);

type SendEmail = {
  to: string;
  subject: string;
  text: string;
};

export const sendEmail = async ({ to, subject, text }: SendEmail) => {
  await resend.emails.send({
    from: `BookHive <${CONTACT_RECEIVER_EMAIL}>`,
    to,
    subject,
    text,
  });
};
