// ==========================================
// EXPORTACIONES CENTRALIZADAS (BARREL FILE)
// ==========================================

/**
 * Punto de Acceso Unificado para Supabase
 * 
 * Agrupa y expone todas las herramientas, clientes y verificadores de Supabase
 * bajo un mismo módulo. Esto optimiza las rutas de importación en el resto de la app.
 * 
 * Ejemplo de uso en tus controladores o servicios:
 * import { supabase } from "../../lib/supabase/index.js";
 */

// Exporta el proveedor, la instancia singleton (supabase) y sus tipados
export * from "./client.js";

// Exporta las herramientas de verificación de tokens o seguridad asociadas a Supabase
export * from "./verifier.js";

// Exporta el servicio de verificación de estado de la base de datos
export * from "./services/supabase-health.service.js";