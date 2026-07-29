// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// SDK oficial de Supabase y sus tipados estructurales
import { createClient, type SupabaseClient } from "@supabase/supabase-js"; 

// Variables de entorno ya validadas y tipadas por Zod
import { env } from "../../config/index.js"; 

// ==========================================
// PROVEEDOR Y CLIENTES DE SUPABASE
// ==========================================

/**
 * Proveedor Central de Supabase (SupabaseProvider)
 * 
 * Clase encargada de instanciar y administrar los clientes de Supabase.
 * Divide los accesos en dos niveles de seguridad bien diferenciados (Client y Admin).
 */
export class SupabaseProvider {
  // Cliente con permisos de administrador (Ignora las reglas RLS de las tablas)
  public readonly admin: SupabaseClient;
  
  // Cliente con permisos estándar de cliente (Respeta las reglas RLS de las tablas)
  public readonly client: SupabaseClient;

  constructor() {
    // 1. Inicialización del Cliente Administrativo (Service Role)
    // Se usa estrictamente en el backend para operaciones del sistema que un usuario común no puede hacer
    this.admin = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY, // Clave secreta y privada de administración
    );

    // 2. Inicialización del Cliente Público (Anon / Publishable)
    // Se usa para operaciones ordinarias donde la seguridad depende de las políticas de la BD (RLS)
    this.client = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_PUBLISHABLE_KEY, // Clave pública segura para exponer
    );
  }
}

// ==========================================
// EXPORTACIÓN DE LA INSTANCIA ÚNICA (SINGLETON)
// ==========================================

/**
 * Instancia global unificada del proveedor de Supabase.
 * Al exportar una constante ya instanciada, evitamos crear múltiples conexiones
 * innecesarias a la base de datos desde diferentes archivos del proyecto.
 */
export const supabase = new SupabaseProvider();
