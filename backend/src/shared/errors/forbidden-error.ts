// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos la clase base de excepciones del sistema
import { AppError } from "./app-error.js"; 

// ==========================================
// CLASE DE ERROR ESPECÍFICO (FORBIDDEN ERROR)
// ==========================================

/**
 * Error de Acceso Prohibido (ForbiddenError)
 * 
 * Excepción especializada que se dispara cuando el servidor entiende quién 
 * es el usuario autenticado, pero este no posee los privilegios o roles 
 * necesarios para interactuar con el recurso solicitado.
 * 
 * Hereda de AppError y fuerza automáticamente el código de estado HTTP 403 (Forbidden).
 */
export class ForbiddenError extends AppError {
  
  constructor(
    message = "Forbidden", // Mensaje descriptivo por defecto si no se especifica uno personalizado
    code = "FORBIDDEN",    // Código de negocio por defecto para la identificación del fallo
  ) {
    // Invoca al constructor de AppError asignando el mensaje, el estado HTTP 403 y el código de negocio
    super(message, 403, code);
  }
}
