import { API_URL } from "../config";
import type { Contact } from "../types";

export const sendContactEmail = async (
  formData: Contact,
): Promise<{ success: true }> => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to send message");
  }

  return await res.json();
};
