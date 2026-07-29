// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos el error de petición incorrecta del cual hereda esta clase
import { BadRequestError } from "./bad-request-error.js"; 

// ==========================================
// CLASE DE ERROR ESPECÍFICO (VALIDATION ERROR)
// ==========================================

/**
 * Error de Validación Estructural (ValidationError)
 * 
 * Excepción especializada que se dispara cuando los datos enviados por el cliente 
 * rompen los esquemas de validación (por ejemplo, reglas de campos requeridos, 
 * formatos de email o longitudes de texto en Zod).
 * 
 * Hereda de BadRequestError, manteniendo el código de estado HTTP 400 (Bad Request)
 * e inyectando un código de negocio fijo de validación.
 */
export class ValidationError extends BadRequestError {
  
  constructor(message = "Validation failed") {
    // Invoca al constructor de BadRequestError asignando el mensaje y el código de negocio fijo
    super(message, "VALIDATION_ERROR");
  }
}
