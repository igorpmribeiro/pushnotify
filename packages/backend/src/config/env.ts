import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  VAPID_PUBLIC_KEY: z.string().min(1, 'VAPID_PUBLIC_KEY is required'),
  VAPID_PRIVATE_KEY: z.string().min(1, 'VAPID_PRIVATE_KEY is required'),
  VAPID_SUBJECT: z.string().min(1, 'VAPID_SUBJECT is required'),

  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  WEBHOOK_SECRET: z.string().optional(),
  ADMIN_API_KEY: z.string().min(1, 'ADMIN_API_KEY is required'),

  RUFER_API_URL: z.string().url().default('https://www.rufer.com.br/ws/v1'),
  RUFER_CLIENT_ID: z.string().min(1, 'RUFER_CLIENT_ID is required'),
  RUFER_CLIENT_SECRET: z.string().min(1, 'RUFER_CLIENT_SECRET is required'),

  CORS_ORIGIN: z.string().default('*'),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    const messages = Object.entries(formatted)
      .filter(([key]) => key !== '_errors')
      .map(([key, value]) => {
        const errors = (value as { _errors: string[] })._errors;
        return `  ${key}: ${errors.join(', ')}`;
      })
      .join('\n');

    throw new Error(`Environment validation failed:\n${messages}`);
  }

  return result.data;
}
