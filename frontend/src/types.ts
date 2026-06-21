export type TurnstileSize = "normal" | "compact";
export type TurnstileTheme = "light" | "dark" | "auto";

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
  size?: TurnstileSize;
  theme?: TurnstileTheme;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  callback?: (token: string) => void;
}

export interface TurnstileInstance {
  render: (
    container: string | HTMLElement,
    options: TurnstileOptions,
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
  getResponse: (widgetId: string) => string;
}

declare global {
  interface Window {
    turnstile: TurnstileInstance;
  }
}
