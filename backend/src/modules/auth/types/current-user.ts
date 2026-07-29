// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos el enumerador de roles para tipar los permisos de la sesión
import type { UserRole } from "./auth.types.js"; 

// ==========================================
// ESTRUCTURAS DE IDENTIDAD EN MEMORIA
// ==========================================

/**
 * Identidad del Usuario en Sesión (CurrentUser)
 * 
 * Interfaz que define la estructura del objeto de usuario que se inyectará 
 * en las peticiones HTTP (`request.user`) tras ser validado por el middleware de autenticación.
 * 
 * Contiene únicamente los datos esenciales para validar accesos, roles y propiedad de recursos.
 */
export interface CurrentUser {
  /**
   * Identificador único del usuario (UUID de autenticación)
   */
  id: string;

  /**
   * Correo electrónico de la sesión activa
   */
  email: string;

  /**
   * Listado de roles asignados que determinan sus permisos en el sistema
   * @example [UserRole.PASSENGER] o [UserRole.DRIVER, UserRole.PASSENGER]
   */
  roles: UserRole[];
}
