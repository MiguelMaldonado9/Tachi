// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos la clase base de excepciones del sistema
import { AppError } from "./app-error.js"; 

// ==========================================
// CLASE DE ERROR ESPECÍFICO (UNAUTHORIZED ERROR)
// ==========================================

/**
 * Error de Falta de Autenticación (UnauthorizedError)
 * 
 * Excepción especializada que se dispara cuando un cliente intenta acceder a una 
 * ruta protegida sin proporcionar credenciales válidas, con un token ausente, 
 * mal estructurado o que ya ha expirado.
 * 
 * Hereda de AppError y fuerza automáticamente el código de estado HTTP 401 (Unauthorized).
 */
export class UnauthorizedError extends AppError {
  
  constructor(
    message = "Unauthorized", // Mensaje descriptivo por defecto si no se especifica uno personalizado
    code = "UNAUTHORIZED",    // Código de negocio por defecto para la identificación del fallo
  ) {
    // Invoca al constructor de AppError asignando el mensaje, el estado HTTP 401 y el código de negocio
    super(message, 401, code);
  }
}
