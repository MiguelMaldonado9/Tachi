// ==========================================
// CONTRACTOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Datos de la Sesión Activa (SessionDTO)
 * 
 * Interfaz que define la estructura de los tokens de seguridad entregados 
 * al cliente. Estos permiten mantener y renovar el acceso a las rutas 
 * protegidas del backend sin pedir credenciales constantemente.
 */
export interface SessionDTO {
  /**
   * Token de Acceso (JWT)
   * Llave de seguridad firmada que el cliente debe adjuntar en las cabeceras HTTP de cada petición.
   */
  accessToken: string;

  /**
   * Token de Refresco
   * Llave de larga duración utilizada para solicitar un nuevo accessToken cuando este expire.
   */
  refreshToken: string;

  /**
   * Tiempo de Vida del Token
   * Duración en segundos que determina la vigencia exacta del accessToken antes de caducar.
   */
  expiresIn: number;
}
