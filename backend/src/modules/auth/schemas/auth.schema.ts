import { z } from "zod";

/* ============================================================
   Login
============================================================ */

export const loginSchema = z.object({
  email: z.string().email(),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100),
});

/* ============================================================
   Refresh Token
============================================================ */

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

/* ============================================================
   Auth User
============================================================ */

export const authUserSchema = z.object({
  id: z.string().uuid(),

  authId: z.string().uuid(),

  name: z.string().min(1),

  email: z.string().email(),

  phone: z.string().nullable(),

  photoUrl: z.string().url().nullable(),
});

/* ============================================================
   Types
============================================================ */

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type AuthUserInput = z.infer<typeof authUserSchema>;