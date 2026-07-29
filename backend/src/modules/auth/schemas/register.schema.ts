// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería de validación de esquemas y tipado estático
import { z } from "zod"; 

// ==========================================
// ESQUEMA DE VALIDACIÓN DE REGISTRO
// ==========================================

/**
 * Esquema de Validación para Registro (registerSchema)
 * 
 * Define las reglas estrictas de formato que deben cumplir los datos 
 * enviados en el cuerpo de la petición HTTP al crear una nueva cuenta.
 */
export const registerSchema = z.object({
  // Obliga a que la cadena de texto cumpla con un formato de email válido
  email: z.string().email(),
  
  // Exige una contraseña segura con una longitud mínima de 8 caracteres
  password: z
    .string()
    .min(8),
  
  // Valida que el nombre sea un texto y tenga al menos 2 caracteres (evita iniciales o campos vacíos)
  firstName: z
    .string()
    .min(2),
  
  // Valida que el apellido sea un texto y contenga un mínimo de 2 caracteres
  lastName: z
    .string()
    .min(2),
});

// ==========================================
// EXPORTACIÓN DE TIPOS INFERIDOS (TYPES)
// ==========================================

/**
 * Tipo inferido automáticamente a partir del esquema de validación de registro.
 * Sincroniza tus interfaces de desarrollo con los criterios de aceptación del esquema.
 */
export type RegisterSchema = z.infer<typeof registerSchema>;
