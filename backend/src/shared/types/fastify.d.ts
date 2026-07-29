// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos el módulo de Fastify para poder extender sus definiciones nativas
import "fastify"; 

// Importamos la interfaz del usuario en sesión que inyectaremos en la petición
import type { CurrentUser } from "../../modules/auth/types/current-user.js"; 

// ==========================================
// EXTENSIÓN DE TIPOS GLOBALES (DECLARATION MERGING)
// ==========================================

/**
 * Ampliación del Módulo de Fastify
 * 
 * Permite inyectar propiedades personalizadas dentro de los tipos nativos del framework.
 * Esto asegura que TypeScript reconozca los nuevos datos agregados en el ciclo de vida
 * de las peticiones sin lanzar errores de compilación.
 */
declare module "fastify" {
  
  /**
   * Extensión de la Interfaz FastifyRequest
   * 
   * Agrega la propiedad opcional 'user' al objeto de la solicitud HTTP.
   * Esto permite que cualquier middleware (como authenticate.ts) guarde los datos del 
   * token descifrado, y que cualquier controlador (como auth.controller.ts) los consuma de forma segura.
   */
  interface FastifyRequest {
    // Propiedad opcional (?): puede ser un objeto CurrentUser válido o undefined si la ruta es pública
    user?: CurrentUser;
  }
}
