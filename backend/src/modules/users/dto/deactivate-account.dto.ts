// ==========================================
// CONTRATOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Datos de Entrada para Desactivación de Cuenta (DeactivateAccountDTO)
 * 
 * Interfaz que define la estructura de datos obligatoria para procesar
 * la desactivación voluntaria de una cuenta de usuario en el sistema.
 * Exige la contraseña como mecanismo final de confirmación de identidad.
 */
export interface DeactivateAccountDTO {
  /**
   * Contraseña de seguridad actual suministrada por el usuario para validar la baja
   * @example "PasswordSegura123!"
   */
  password: string;
}
