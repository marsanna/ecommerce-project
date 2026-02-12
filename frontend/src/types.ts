export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
};

export type Contact = {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
};

export type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
}

export interface TurnstileInstance {
  render: (
    container: string | HTMLElement,
    options: TurnstileOptions,
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  getResponse: (widgetId: string) => string;
}

declare global {
  interface Window {
    turnstile: TurnstileInstance;
  }
}
