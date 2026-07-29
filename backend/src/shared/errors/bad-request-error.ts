// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos la clase base de excepciones del sistema
import { AppError } from "./app-error.js"; 

// ==========================================
// CLASE DE ERROR ESPECÍFICO (BAD REQUEST)
// ==========================================

/**
 * Error de Petición Incorrecta (BadRequestError)
 * 
 * Excepción especializada que se dispara cuando el servidor no puede procesar 
 * una solicitud debido a que los datos enviados por el cliente son inválidos, 
 * incompletos o tienen un formato incorrecto.
 * 
 * Hereda de AppError y fuerza automáticamente el código de estado HTTP 400 (Bad Request).
 */
export class BadRequestError extends AppError {
  
  constructor(
    message = "Bad request", // Mensaje por defecto si no se pasa uno personalizado
    code = "BAD_REQUEST",    // Código de negocio por defecto para identificar el tipo de fallo
  ) {
    // Invoca al constructor base (AppError) inyectando el mensaje, el estado HTTP 400 y el código de negocio
    super(message, 400, code);
  }
}
