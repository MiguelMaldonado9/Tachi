// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería de validación de esquemas y tipado en tiempo de ejecución
import { z } from "zod"; 

// ==========================================
// ESQUEMA DE VALIDACIÓN (VARIABLES DE ENTORNO)
// ==========================================

// Define la estructura exacta y las reglas que deben cumplir las variables del archivo .env
const envSchema = z.object({
  // Entorno de ejecución: solo permite uno de estos tres valores
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Puerto del servidor: toma el texto del .env, lo transforma a número y si no existe usa el 3000
  PORT: z.coerce.number().default(3000),

  // URL del proyecto de Supabase (Debe tener un formato de URL válido)
  SUPABASE_URL: z.string().url(),

  // Clave pública/anon de Supabase (Obligatoria, mínimo 1 carácter)
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),

  // Clave privada de administración de Supabase (Obligatoria, saltándose políticas RLS)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Emisor de los tokens JWT de Supabase (Debe ser una URL válida)
  SUPABASE_JWT_ISSUER: z.string().url(),
});

// ==========================================
// EXPORTACIÓN Y VALIDACIÓN EN TIEMPO DE EJECUCIÓN
// ==========================================

/**
 * Objeto de Entorno Validado
 * 
 * Toma las variables crudas de 'process.env' y las pasa por el esquema de Zod.
 * Si falta alguna variable obligatoria, el backend se detendrá inmediatamente 
 * lanzando un error detallado en la consola antes de que la app falle en producción.
 */
export const env = envSchema.parse(process.env);
