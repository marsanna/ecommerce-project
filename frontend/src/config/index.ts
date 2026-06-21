export const API_URL = import.meta.env.VITE_APP_SERVER_URL;
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

if (!API_URL) {
  throw new Error("API URL is required, are you missing a .env file?");
}

if (!TURNSTILE_SITE_KEY) {
  console.warn(
    "VITE_TURNSTILE_SITE_KEY is missing. The contact form will be disabled.",
  );
}
