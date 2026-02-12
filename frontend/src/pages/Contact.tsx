import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { sendContactMessage } from "../data/contact.ts";
import type { ContactForm } from "../types.ts";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!widgetRef.current) return;

    const renderWidget = () => {
      if (widgetId.current) return;
      if (window.turnstile && widgetRef.current) {
        widgetId.current = window.turnstile.render(widgetRef.current, {
          sitekey: turnstileSiteKey,
          callback: (token: string) => {
            setTurnstileToken(token);
            setError("");
          },
          "error-callback": () => {
            setError("Cloudflare Security Error. Please refresh.");
            setTurnstileToken("");
          },
          "expired-callback": () => {
            setError("Security token expired. Please verify again.");
            setTurnstileToken("");
          },
          theme: "light",
        });
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const script = document.querySelector(
        'script[src*="turnstile/v0/api.js"]',
      );
      if (script) {
        script.addEventListener("load", renderWidget);
      }
    }

    return () => {
      const script = document.querySelector(
        'script[src*="turnstile/v0/api.js"]',
      );
      if (script) {
        script.removeEventListener("load", renderWidget);
      }
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  const onChange =
    (key: keyof ContactForm) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.subject.trim() &&
    form.message.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!canSubmit || !turnstileToken) {
      setError("Please solve the security check.");
      return;
    }

    try {
      setSubmitting(true);
      await sendContactMessage({ ...form, turnstileToken });
      setSuccess("Thank you! Your message has been sent.");
      setForm(initialForm);

      if (widgetId.current) {
        window.turnstile.reset(widgetId.current);
      }
      setTurnstileToken("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send a message");
      if (widgetId.current) {
        window.turnstile.reset(widgetId.current);
        setTurnstileToken("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="my-5 text-lg font-bold">Contact</h1>
      <form
        onSubmit={onSubmit}
        className="mx-auto my-5 flex flex-col gap-3 md:w-1/2"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 text-gray-400 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            name="name"
            value={form.name}
            onChange={onChange("name")}
            disabled={submitting}
            className="grow bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Name"
            required
          />
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 text-gray-400 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange("email")}
            disabled={submitting}
            className="grow bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Email"
            required
          />
        </label>

        <div className="relative">
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 text-gray-400 opacity-70"
            >
              <path d="M1.75 3a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H1.75ZM1.75 6a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H1.75ZM1.75 9a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H1.75ZM1.75 12a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H1.75Z" />
            </svg>
            <select
              name="subject"
              value={form.subject}
              onChange={onChange("subject")}
              disabled={submitting}
              className="grow appearance-none bg-transparent outline-none placeholder:text-gray-400"
              required
            >
              <option value="" disabled hidden>
                Subject
              </option>
              <option value="general">General question</option>
              <option value="technical">Technical issue</option>
              <option value="feedback">Feedback / idea</option>
            </select>
          </label>
        </div>

        <label className="flex items-start gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="mt-1 h-4 w-4 text-gray-400 opacity-70"
          >
            <path d="M1 4.75V11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4.75a2.75 2.75 0 0 0-2.75-2.75H3.75A2.75 2.75 0 0 0 1 4.75Zm2.75-.75h8.5c.69 0 1.25.56 1.25 1.25v.558l-5.122 3.033a.75.75 0 0 1-.756 0L1 5.808V5.25C1 4.56 1.56 4 2.25 4Z" />
          </svg>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange("message")}
            disabled={submitting}
            className="min-h-32 grow resize-none bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Message"
            required
          />
        </label>

        <div className="mt-2 flex justify-center" ref={widgetRef}></div>

        <button
          type="submit"
          disabled={submitting || !canSubmit || !turnstileToken}
          className="mt-2 cursor-pointer self-center rounded-lg bg-blue-600 px-10 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </>
  );
}
