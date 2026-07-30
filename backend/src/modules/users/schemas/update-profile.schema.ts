// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería de validación de esquemas y tipado estático
import { z } from "zod"; 

// ==========================================
// ESQUEMA DE VALIDACIÓN DE ACTUALIZACIÓN
// ==========================================

/**
 * Esquema de Validación para Actualizar Perfil (updateProfileSchema)
 * 
 * Define las reglas estrictas de formato que deben cumplir los datos 
 * enviados en el cuerpo de la petición HTTP al modificar el perfil del usuario.
 */
export const updateProfileSchema = z.object({
  // Obliga a que el nombre sea un texto, con longitud mínima de 2 caracteres y máxima de 100
  name: z
    .string()
    .min(2)
    .max(100),
  
  // Valida que el teléfono tenga máximo 20 caracteres y acepte explícitamente nulos (null)
  phone: z
    .string()
    .max(20)
    .nullable(),
  
  // Valida que la foto de perfil cumpla con un formato URL real o acepte valores nulos (null)
  photoUrl: z
    .string()
    .url()
    .nullable(),
});

// ==========================================
// EXPORTACIÓN DE TIPOS INFERIDOS (TYPES)
// ==========================================

/**
 * Tipo inferido automáticamente a partir del esquema de validación de perfil.
 * Sincroniza las interfaces internas de tus servicios con los criterios de validación de Zod.
 */
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
