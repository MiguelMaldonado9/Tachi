// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Estructura de transferencia de datos del perfil de usuario
import type { UserDTO } from "../../users/dto/user.dto.js"; 

// Estructura de transferencia de datos de la sesión criptográfica (tokens)
import type { SessionDTO } from "./session.dto.js"; 

// ==========================================
// CONTRACTOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Respuesta Estructurada de Login (LoginResponseDTO)
 * 
 * Interfaz que define el formato estricto y unificado que el backend 
 * retornará al frontend tras una autenticación exitosa.
 * 
 * Combina la información de identidad del usuario con sus credenciales de acceso vigentes.
 */
export interface LoginResponseDTO {
  /**
   * Información del Perfil del Usuario
   * Contiene datos públicos y seguros del usuario autenticado (ej. ID, email, nombre, etc.)
   */
  user: UserDTO;

  /**
   * Información de la Sesión Activa
   * Contiene las llaves de acceso de seguridad (ej. access_token, refresh_token, expiración)
   */
  session: SessionDTO;
}
