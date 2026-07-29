// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos las variables de entorno validadas para conocer el entorno actual (Dev/Prod)
import { env } from "./env.js"; 

// ==========================================
// CONFIGURACIÓN DEL SISTEMA DE REGISTRO (LOGGER)
// ==========================================

/**
 * Configuración del Logger de Fastify
 * 
 * Define el comportamiento del registrador de eventos (basado internamente en Pino).
 * Ajusta automáticamente el nivel de detalle y el formato visual de la consola
 * dependiendo de si la aplicación corre en Desarrollo o en Producción.
 */
export const logger = {
  // Define la sensibilidad de los logs: 
  // En producción solo muestra información general ('info'), en desarrollo muestra todo al detalle ('debug')
  level: env.NODE_ENV === "production" ? "info" : "debug",

  // Configura el formateador visual de la terminal
  transport: env.NODE_ENV !== "production" 
    ? {
        // En desarrollo usamos 'pino-pretty' para que los logs sean legibles por humanos
        target: "pino-pretty", 
        options: {
          colorize: true,              // Agrega colores a las palabras clave (GET, POST, 200, 500, etc.)
          translateTime: "SYS:standard", // Transforma los timestamps crudos en fechas y horas legibles
        },
      } 
    : undefined, // En producción se desactiva el formato bonito para priorizar la velocidad extrema (vuelven a ser JSON puros)
};
