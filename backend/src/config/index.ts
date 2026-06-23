import { z } from "zod/v4";

const envSchema = z.object({
  MONGO_URI: z.url({ protocol: /mongodb/ }),
  DB_NAME: z.string(),
  REFRESH_TOKEN_TTL: z.coerce.number().default(30 * 24 * 60 * 60), // 30 days in seconds
  SALT_ROUNDS: z.coerce.number().default(13),
  ACCESS_JWT_SECRET: z
    .string({
      error:
        "ACCESS_JWT_SECRET is required and must be at least 64 characters long",
    })
    .min(64),
  CLIENT_BASE_URL: z.url().default("http://localhost:5173"),
  RESEND_API_KEY: z.string(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  CONTACT_RECEIVER_EMAIL: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    z.prettifyError(parsedEnv.error),
  );
  process.exit(1);
}

export const {
  MONGO_URI,
  DB_NAME,
  REFRESH_TOKEN_TTL,
  SALT_ROUNDS,
  ACCESS_JWT_SECRET,
  CLIENT_BASE_URL,
  RESEND_API_KEY,
  CONTACT_RECEIVER_EMAIL,
  TURNSTILE_SECRET_KEY,
} = parsedEnv.data;
