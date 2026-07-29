// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importamos el cliente centralizado de Supabase configurado en el proyecto
import { supabase } from "../index.js"; 

// ==========================================
// SERVICIO DE VERIFICACIÓN DE ESTADO
// ==========================================

/**
 * Servicio de Diagnóstico para Supabase
 * 
 * Se encarga de evaluar si la conexión entre el backend y la base de datos 
 * de Supabase está activa y respondiendo de forma correcta.
 */
export class SupabaseHealthService {
  
  /**
   * Comprueba la Conexión con la Base de Datos
   * 
   * Realiza una consulta mínima y de bajo costo a la tabla 'users' para verificar 
   * el acceso. Si la base de datos responde sin fallos, confirma el estado positivo.
   * 
   * @throws {Error} Lanza el error original de Supabase si la consulta falla.
   * @returns {Promise<{ connected: boolean }>} Estado de confirmación de conectividad.
   */
  async checkConnection() {
    // Ejecuta una petición SELECT ultraligera limitándola a un solo registro para no saturar
    // Utiliza el cliente administrativo (.admin) para saltarse políticas RLS en esta prueba
    const { error } = await supabase.admin
      .from("users")
      .select("*")
      .limit(1);

    // Si la base de datos devolvió algún error (problemas de red, credenciales inválidas, etc.)
    if (error) {
      throw error; // Corta la ejecución enviando el fallo para que lo capture el manejador global
    }

    // Si todo salió bien y la comunicación fue exitosa
    return {
      connected: true,
    };
  }
}
