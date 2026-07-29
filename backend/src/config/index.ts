// ==========================================
// EXPORTACIONES CENTRALIZADAS (BARREL FILE)
// ==========================================

/**
 * Punto Central de Configuración
 * 
 * Exporta absolutamente todo el contenido del archivo 'env.js' (esquemas y variables validadas).
 * Esto permite que otros archivos del proyecto importen la configuración directamente desde 
 * la carpeta "../config" en lugar de apuntar directamente al archivo específico.
 * 
 * Ejemplo de uso en otra parte del código:
 * import { env } from "../config/index.js";
 */
export * from "./env.js";
