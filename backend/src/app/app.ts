// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Framework web principal
import Fastify from "fastify"; 

// Configuraciones locales del ciclo de vida de la app
import { registerPlugins } from "./plugins.js";
import { registerRoutes } from "./routes.js";

// Herramientas e infraestructura del sistema (Logger)
import { logger } from "../config/logger.js";

// Manejo global de excepciones y fallos
import { registerErrorHandler } from "../shared/errors/error-handler.js";

// ==========================================
// ARQUITECTURA DE LA APLICACIÓN
// ==========================================

/**
 * Fábrica de la Aplicación (App Factory)
 * 
 * Se encarga de inicializar, configurar e integrar todos los componentes 
 * esenciales del servidor Fastify en el orden correcto de ejecución.
 * 
 * @returns {Promise<import('fastify').FastifyInstance>} Instancia de la app configurada y lista para iniciar.
 */
export async function buildApp() {
  // 1. Inicializa la instancia de Fastify aplicando la configuración del logger personalizado
  const app = Fastify({
    logger,
  });

  // 2. Registra el manejador global de errores (debe ir al principio para capturar fallos tempranos)
  registerErrorHandler(app);

  // 3. Carga e inyecta los plugins del sistema (BD, seguridad, CORS, etc.)
  await registerPlugins(app);

  // 4. Registra los endpoints y rutas de la API mapeados en la aplicación
  await registerRoutes(app);

  // Devuelve la instancia completamente armada para que el archivo del servidor la escuche (listen)
  return app;
}
