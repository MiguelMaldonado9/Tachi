// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería de validación de esquemas y tipado estático
import { z } from "zod"; 

// ==========================================
// ESQUEMA DE VALIDACIÓN DE DESACTIVACIÓN
// ==========================================

/**
 * Esquema de Validación para Desactivación de Cuenta (deactivateAccountSchema)
 * 
 * Define las reglas estrictas en tiempo de ejecución para el proceso de baja voluntaria.
 * Valida que el formato de la contraseña ingresada cumpla con los mínimos de seguridad.
 */
export const deactivateAccountSchema = z.object({
  // Exige que la contraseña tenga un formato de texto con un mínimo de 8 caracteres
  password: z
    .string()
    .min(8),
});

// ==========================================
// EXPORTACIÓN DE TIPOS INFERIDOS (TYPES)
// ==========================================

/**
 * Tipo inferido automáticamente a partir del esquema de desactivación de cuenta.
 * Permite tipar los datos limpios de la petición en controladores y servicios.
 */
export type DeactivateAccountSchema = z.infer<typeof deactivateAccountSchema>;
