// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipado oficial de la instancia de Fastify
import { FastifyInstance } from "fastify"; 

// Clase base de errores personalizados del sistema
import { AppError } from "./app-error.js"; 

// ==========================================
// MANEJADOR GLOBAL DE EXCEPCIONES (ERROR HANDLER)
// ==========================================

/**
 * Registro Centralizado del Manejador de Errores
 * 
 * Intercepta cualquier excepción o fallo que ocurra durante el ciclo de vida 
 * de una petición HTTP en la aplicación. Separa los errores controlados de negocio 
 * de los fallos inesperados de infraestructura.
 * 
 * @param {FastifyInstance} app - Instancia del servidor Fastify en desarrollo.
 */
export function registerErrorHandler(app: FastifyInstance) {
  
  // Define el gancho global de Fastify para la captura de errores
  app.setErrorHandler((error, request, reply) => {
    
    // 1. Primer Filtro: Errores controlados de la aplicación (AppError)
    // Si el error es una instancia de nuestras clases personalizadas (400, 404, 409, etc.)
    if (error instanceof AppError) {
      return reply
        .status(error.statusCode) // Aplica el código HTTP exacto definido en el error
        .send({
          success: false,
          error: {
            code: error.code,       // Código único de negocio (ej. 'EMAIL_ALREADY_EXISTS')
            message: error.message, // Mensaje descriptivo limpio para el cliente
          },
        });
    }

    // 2. Segundo Filtro: Errores no controlados o inesperados del sistema
    // Registra el error completo en la consola/sistema de monitoreo usando el logger inyectado en la petición
    request.log.error(error);

    // Responde al cliente de forma genérica y segura con un código HTTP 500 (Internal Server Error)
    // Esto previene la fuga de información sensible (como trazas de base de datos) hacia el exterior
    return reply
      .status(500)
      .send({
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error interno del servidor",
        },
      });
  });
}
