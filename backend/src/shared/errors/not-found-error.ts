// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos la clase base de excepciones del sistema
import { AppError } from "./app-error.js"; 

// ==========================================
// CLASE DE ERROR ESPECÍFICO (NOT FOUND ERROR)
// ==========================================

/**
 * Error de Recurso No Encontrado (NotFoundError)
 * 
 * Excepción especializada que se dispara cuando un cliente intenta acceder o
 * realizar una operación sobre un registro, archivo o endpoint que no existe 
 * físicamente en el sistema o en la base de datos.
 * 
 * Hereda de AppError y fuerza automáticamente el código de estado HTTP 404 (Not Found).
 */
export class NotFoundError extends AppError {
  
  constructor(
    message = "Resource not found", // Mensaje descriptivo por defecto si no se especifica uno personalizado
    code = "NOT_FOUND",           // Código de negocio por defecto para la identificación del fallo
  ) {
    // Invoca al constructor de AppError asignando el mensaje, el estado HTTP 404 y el código de negocio
    super(message, 404, code);
  }
}
