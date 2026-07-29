import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  SUPABASE_URL: z.string().url(),

  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  SUPABASE_JWT_ISSUER: z.string().url(),
});

export const env = envSchema.parse(process.env);