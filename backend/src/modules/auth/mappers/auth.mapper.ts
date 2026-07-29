// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Entidad de usuario nativa provista por el SDK de Supabase
import type { User } from "@supabase/supabase-js"; 

// Estructura de transferencia de datos del perfil de usuario de tu sistema
import type { UserDTO } from "../../users/dto/user.dto.js"; 

// Enumerador de estados de usuario definidos en tu módulo de autenticación
import { UserStatus } from "../types/auth.types.js"; 

// ==========================================
// TRADUCTOR DE ESTRUCTURAS (AUTH MAPPER)
// ==========================================

/**
 * Mapeador de Autenticación
 * 
 * Clase de utilidad con métodos estáticos encargada de transformar los datos 
 * crudos devueltos por el proveedor de identidad externo (Supabase Auth)
 * en estructuras estandarizadas y limpias para nuestro propio dominio (UserDTO).
 */
export class AuthMapper {
  
  /**
   * Transforma un Usuario de Supabase en un UserDTO
   * 
   * Toma el formato de datos de Supabase y extrae los campos clave, limpiando
   * nulos, asignando estados por defecto y estructurando la salida del perfil.
   * 
   * @param {User} user - Objeto de usuario nativo proveniente de Supabase.
   * @returns {UserDTO} Objeto formateado según los estándares de tu backend.
   */
  static toDto(user: User): UserDTO {
    return {
      id: user.id,                                // ID del registro
      authId: user.id,                            // ID de autenticación vinculado en el sistema
      email: user.email ?? "",                    // Correo electrónico (asegura texto si viene indefinido)
      name: user.user_metadata.full_name ?? "",   // Extrae el nombre completo desde los metadatos de Supabase
      phone: null,                                // Inicializado en nulo (para ser completado en base de datos externa)
      photoUrl: null,                             // Inicializado en nulo (para manejo de imágenes de perfil futuro)
      roles: [],                                  // Arreglo de roles inicializado vacío
      status: UserStatus.PENDING,                 // Asigna por defecto el estado PENDIENTE hasta confirmar cuenta
    };
  }
}
