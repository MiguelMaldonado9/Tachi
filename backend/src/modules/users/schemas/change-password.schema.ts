// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería de validación de esquemas y tipado estático
import { z } from "zod"; 

// ==========================================
// ESQUEMA DE VALIDACIÓN DE CAMBIO DE CLAVE
// ==========================================

/**
 * Esquema de Validación para Cambio de Contraseña (changePasswordSchema)
 * 
 * Define las reglas estrictas de formato en tiempo de ejecución para asegurar
 * que tanto la contraseña actual como la nueva cumplan con las políticas de seguridad.
 */
export const changePasswordSchema = z.object({
  // Exige que la contraseña actual sea un texto con un mínimo de 8 caracteres
  currentPassword: z
    .string()
    .min(8),
  
  // Exige que la nueva contraseña tenga una longitud mínima de 8 caracteres por seguridad
  newPassword: z
    .string()
    .min(8),
});

// ==========================================
// EXPORTACIÓN DE TIPOS INFERIDOS (TYPES)
// ==========================================

/**
 * Tipo inferido automáticamente a partir del esquema de cambio de contraseña.
 * Sincroniza las interfaces de TypeScript con las validaciones físicas de Zod.
 */
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
