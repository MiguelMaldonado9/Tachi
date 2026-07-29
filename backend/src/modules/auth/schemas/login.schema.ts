// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería de validación de esquemas y tipado estático
import { z } from "zod"; 

// ==========================================
// ESQUEMA DE VALIDACIÓN DE INICIO DE SESIÓN
// ==========================================

/**
 * Esquema de Validación para Login (loginSchema)
 * 
 * Define las reglas estrictas de formato que deben cumplir los datos 
 * enviados en el cuerpo de la petición HTTP al intentar iniciar sesión.
 */
export const loginSchema = z.object({
  // Obliga a que la cadena de texto cumpla con un formato de email válido
  email: z
    .string()
    .email(),
  
  // Obliga a que la contraseña tenga una longitud mínima de 8 caracteres por seguridad
  password: z
    .string()
    .min(8),
});

// ==========================================
// EXPORTACIÓN DE TIPOS INFERIDOS (TYPES)
// ==========================================

/**
 * Tipo inferido automáticamente a partir del esquema de validación de login.
 * Te servirá para tipar los datos limpios y procesados dentro de tus controladores o servicios.
 */
export type LoginSchema = z.infer<typeof loginSchema>;
