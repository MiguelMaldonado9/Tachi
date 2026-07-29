// ==========================================
// EXPORTACIONES CENTRALIZADAS (BARREL FILE)
// ==========================================

/**
 * Punto de Entrada Público del Módulo de Autenticación
 * 
 * Expone hacia el exterior los componentes necesarios para que la aplicación global
 * pueda integrar el módulo sin necesidad de conocer su estructura interna de carpetas.
 * 
 * Este archivo es consumido directamente por el enrutador central en 'src/app/routes.ts'.
 */

// Exporta el enrutador modular que agrupa los endpoints de login, register y me
export { authRoutes } from "./routes/auth.routes.js";
