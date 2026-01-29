import { z } from 'zod/v4';

const emailError = 'Please provide a valid email address.';
const emailSchema = z.email({ error: emailError }).trim();

const basePasswordSchema = z
  .string({ error: 'Password must be a string' })
  .min(12, { error: 'Password must be at least 12 characters.' })
  .max(512, { error: 'The length of this Password is excessive.' });

export const registerSchema = z
  .strictObject(
    {
      email: emailSchema,
      password: basePasswordSchema
        .regex(/[a-z]/, { error: 'Password must include at least one lowercase letter.' })
        .regex(/[A-Z]/, { error: 'Password must include at least one uppercase letter.' })
        .regex(/[0-9]/, { error: 'Password must include at least one number.' })
        .regex(/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>/?`~]/, {
          error: 'Password must include at least one special character'
        }),
      confirmPassword: z.string(),
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      roles: z.array(z.string()).optional()
    },
    { error: 'Please provide a valid email and a secure password.' }
  )
  .refine(data => data.password === data.confirmPassword, { error: "Passwords don't match" });

export const loginSchema = z.object({
  email: emailSchema,
  password: basePasswordSchema
});
