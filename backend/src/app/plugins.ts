// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipados oficiales de Fastify
import { FastifyInstance } from "fastify"; 

// Plugin de seguridad (Configura cabeceras HTTP seguras)
import helmet from "@fastify/helmet"; 

// Plugin de conectividad (Control de Acceso de Origen Cruzado)
import cors from "@fastify/cors"; 

// ==========================================
// REGISTRO DE PLUGINS (MIDDLEWARES)
// ==========================================

/**
 * Registro Global de Plugins
 * 
 * Configura los middlewares del sistema encargados de proteger la API
 * y permitir la comunicación con el frontend de manera segura.
 * 
 * @param {FastifyInstance} app - Instancia del servidor Fastify en desarrollo.
 */
export async function registerPlugins(app: FastifyInstance) {
  // 1. Registra Helmet para proteger la app de vulnerabilidades web web comunes (XSS, Clickjacking, etc.)
  await app.register(helmet);

  // 2. Registra CORS para permitir que aplicaciones externas (frontend) consuman esta API
  await app.register(cors, {
    // Permite peticiones desde cualquier origen (útil en desarrollo)
    origin: true, 
    // Permite el envío de cookies, cabeceras de autorización o sesiones TLS entre cliente y servidor
    credentials: true, 
  });
}
