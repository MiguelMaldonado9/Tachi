// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos la clase base de excepciones del sistema
import { AppError } from "./app-error.js"; 

// ==========================================
// CLASE DE ERROR ESPECÍFICO (CONFLICT ERROR)
// ==========================================

/**
 * Error de Conflicto en el Estado del Recurso (ConflictError)
 * 
 * Excepción especializada que se dispara cuando una solicitud no puede completarse
 * debido a un conflicto con el estado actual del recurso en el servidor.
 * 
 * Hereda de AppError y fuerza automáticamente el código de estado HTTP 409 (Conflict).
 */
export class ConflictError extends AppError {
  
  constructor(
    message = "Conflict", // Mensaje descriptivo por defecto si no se especifica uno personalizado
    code = "CONFLICT",    // Código de negocio por defecto para la identificación del fallo
  ) {
    // Invoca al constructor de AppError asignando el mensaje, el estado HTTP 409 y el código de negocio
    super(message, 409, code);
  }
}
