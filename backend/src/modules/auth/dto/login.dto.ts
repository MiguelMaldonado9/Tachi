// ==========================================
// CONTRACTOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Datos de Entrada para Login (LoginDTO)
 * 
 * Interfaz que define la estructura de datos obligatoria que el cliente (frontend)
 * debe enviar en el cuerpo de la petición HTTP para intentar iniciar sesión.
 */
export interface LoginDTO {
  /**
   * Correo electrónico de la cuenta del usuario
   * @example "usuario@correo.com"
   */
  email: string;

  /**
   * Contraseña en texto plano suministrada por el usuario
   * @example "PasswordSegura123!"
   */
  password: string;
}
