// ==========================================
// ESTRUCTURA BASE DE EXCEPCIONES (APP ERROR)
// ==========================================

/**
 * Clase Base de Errores de la Aplicación (AppError)
 * 
 * Extiende la clase nativa 'Error' de JavaScript para centralizar y estandarizar
 * las excepciones del sistema, permitiendo inyectar códigos de estado HTTP
 * y códigos de error de negocio personalizados.
 */
export class AppError extends Error {
  
  constructor(
    message: string,                      // Mensaje descriptivo legible por el desarrollador/cliente
    public readonly statusCode: number,   // Código de estado HTTP correspondiente (ej. 400, 404, 500)
    public readonly code: string,         // Identificador único de negocio en texto plano (ej. 'INVALID_TOKEN')
  ) {
    // 1. Invoca al constructor de la clase Error original para registrar el mensaje
    super(message);

    // 2. Asigna dinámicamente el nombre de la clase hija que se está instanciando (ej. 'ConflictError')
    this.name = this.constructor.name;

    // 3. Captura la traza de la pila (StackTrace) omitiendo las llamadas internas del constructor
    // Esto es muy útil en desarrollo para saber la línea exacta del código donde nació el error
    Error.captureStackTrace?.(this, this.constructor);
  }
}
