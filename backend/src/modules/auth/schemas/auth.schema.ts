// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería de validación de esquemas estricta y tipado estático
import { z } from "zod"; 

// ==========================================
// ESQUEMAS DE VALIDACIÓN DE DATOS (ZOD)
// ==========================================

/* ------------------------------------------
   Esquema de Inicio de Sesión (Login)
   ------------------------------------------ */
/**
 * Reglas de validación para el cuerpo de la petición de inicio de sesión.
 */
export const loginSchema = z.object({
  // Debe ser un correo con formato electrónico válido (ejemplo@dominio.com)
  email: z.string().email(),
  
  // Texto obligatorio con longitud mínima de 8 caracteres y máxima de 100 por seguridad
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(100),
});

/* ------------------------------------------
   Esquema de Renovación de Token (Refresh Token)
   ------------------------------------------ */
/**
 * Reglas de validación para solicitudes de refresco de sesión expirada.
 */
export const refreshTokenSchema = z.object({
  // Asegura que la cadena del token de refresco no venga vacía
  refreshToken: z.string().min(1),
});

/* ------------------------------------------
   Esquema de Identidad del Usuario (Auth User)
   ------------------------------------------ */
/**
 * Reglas de validación estructural para la representación interna del usuario.
 */
export const authUserSchema = z.object({
  // Identificador único del registro en formato estándar UUID v4
  id: z.string().uuid(),
  
  // ID de vinculación del proveedor de autenticación externa en formato UUID v4
  authId: z.string().uuid(),
  
  // Nombre completo obligatorio (mínimo 1 carácter de longitud)
  name: z.string().min(1),
  
  // Correo electrónico principal estructurado correctamente
  email: z.string().email(),
  
  // Teléfono de contacto opcional: acepta texto válido o valores nulos (null)
  phone: z.string().nullable(),
  
  // URL de la imagen de perfil opcional: valida formato URL o valores nulos (null)
  photoUrl: z.string().url().nullable(),
});

// ==========================================
// EXPORTACIÓN DE TIPOS INFERIDOS (TYPES)
// ==========================================

/** Tipo TypeScript derivado automáticamente a partir de las reglas del loginSchema */
export type LoginInput = z.infer<typeof loginSchema>;

/** Tipo TypeScript derivado automáticamente a partir de las reglas del refreshTokenSchema */
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

/** Tipo TypeScript derivado automáticamente a partir de las reglas del authUserSchema */
export type AuthUserInput = z.infer<typeof authUserSchema>;
