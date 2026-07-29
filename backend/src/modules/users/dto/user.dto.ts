// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos los diccionarios de roles y estados del módulo de autenticación
import { UserRole, UserStatus } from "../../auth/types/auth.types.js"; 

// ==========================================
// CONTRACTOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Objeto de Transferencia de Datos de Usuario (UserDTO)
 * 
 * Interfaz que determina el formato estandarizado y seguro con el que 
 * se representará la información de perfil de un usuario dentro del sistema,
 * ocultando datos sensibles (como contraseñas) antes de enviarla a los clientes.
 */
export interface UserDTO {
  /**
   * Identificador único interno del registro en la base de datos de negocio
   */
  id: string;

  /**
   * ID único de vinculación asignado por el proveedor de autenticación (Supabase Auth)
   */
  authId: string;

  /**
   * Nombre completo registrado por el usuario
   */
  name: string;

  /**
   * Dirección de correo electrónico asociada al perfil
   */
  email: string;

  /**
   * Número de teléfono de contacto móvil (acepta texto o nulo si no ha sido configurado)
   */
  phone: string | null;

  /**
   * Dirección URL que apunta a la imagen de avatar del perfil (acepta texto o nulo si no tiene)
   */
  photoUrl: string | null;

  /**
   * Listado de roles que determinan los permisos operativos actuales del usuario
   */
  roles: UserRole[];

  /**
   * Estado administrativo vigente en el ciclo de vida de la cuenta (ACTIVE, PENDING, etc.)
   */
  status: UserStatus;
}
