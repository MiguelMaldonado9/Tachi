// ==========================================
// CONTRATOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Datos de Entrada para Cambio de Contraseña (ChangePasswordDTO)
 * 
 * Interfaz que define la estructura obligatoria que el cliente debe enviar
 * para procesar la actualización de la contraseña de un usuario autenticado.
 * Requiere la verificación del secreto anterior por razones de seguridad.
 */
export interface ChangePasswordDTO {
  /**
   * Contraseña actual del usuario en texto plano (sirve para validar la identidad)
   * @example "ClaveAnterior123!"
   */
  currentPassword: string;

  /**
   * Nueva contraseña de seguridad que el usuario desea asignar a su cuenta
   * @example "NuevaClaveSuperSegura2026!"
   */
  newPassword: string;
}
