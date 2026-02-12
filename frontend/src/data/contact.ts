import type { Contact } from "../types.ts";

const API_URL: string | undefined = import.meta.env.VITE_APP_SERVER_URL as
  | string
  | undefined;
if (!API_URL)
  throw new Error("API URL is required, are you missing a .env file?");
const baseURL: string = `${API_URL}/contact`;

export const sendContactMessage = async (
  formData: Contact,
): Promise<{ success: boolean }> => {
  const res = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to send a message");
  }

  return await res.json();
};
