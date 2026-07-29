// ==========================================
// EXPORTACIONES CENTRALIZADAS (BARREL FILE)
// ==========================================

/**
 * Punto Central de Excepciones del Sistema
 * 
 * Agrupa y reexporta todas las clases de error personalizadas de la aplicación.
 * Esto permite que cualquier controlador, servicio o repositorio importe múltiples
 * errores desde la ruta única "./shared/errors/index.js".
 * 
 * Ejemplo de uso en tus servicios:
 * import { NotFoundError, ConflictError } from "../../../shared/errors/index.js";
 */

// Clase base fundamental para la construcción de excepciones
export * from "./app-error.js";

// Error de cliente: Datos de petición incorrectos o mal estructurados (HTTP 400)
export * from "./bad-request-error.js";

// Error de negocio: Conflictos con el estado actual de un recurso (HTTP 409)
export * from "./conflict-error.js";

// Error de autorización: Usuario autenticado pero sin los roles necesarios (HTTP 403)
export * from "./forbidden-error.js";

// Error de infraestructura: Fallos críticos inesperados en el backend (HTTP 500)
export * from "./internal-server-error.js";

// Error de negocio: Recurso o registro inexistente en el sistema (HTTP 404)
export * from "./not-found-error.js";

// Error de autenticación: Token faltante, expirado o con firma inválida (HTTP 401)
export * from "./unauthorized-error.js";

// Error de formato: Fallos estrictos en la validación estructural de esquemas
export * from "./validation-error.js";
