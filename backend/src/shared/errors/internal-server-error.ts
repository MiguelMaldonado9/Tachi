// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos la clase base de excepciones del sistema
import { AppError } from "./app-error.js"; 

// ==========================================
// CLASE DE ERROR ESPECÍFICO (INTERNAL SERVER ERROR)
// ==========================================

/**
 * Error Interno del Servidor (InternalServerError)
 * 
 * Excepción especializada que se dispara cuando ocurre un fallo imprevisto,
 * un error de infraestructura o una anomalía no controlada en el backend 
 * (como una caída de conexión con la base de datos).
 * 
 * Hereda de AppError y fuerza automáticamente el código de estado HTTP 500 (Internal Server Error).
 */
export class InternalServerError extends AppError {
  
  constructor(message = "Internal server error") {
    // Invoca al constructor de AppError inyectando el mensaje, el estado HTTP 500 y el código de negocio fijo
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}
