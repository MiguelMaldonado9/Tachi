// ==========================================
// CONTRACTOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Datos de Entrada para Registro (RegisterDTO)
 * 
 * Interfaz que define la estructura obligatoria y los campos de perfil
 * que el cliente debe enviar en el cuerpo de la petición HTTP para dar de alta
 * a un nuevo usuario en el sistema.
 */
export interface RegisterDTO {
  /**
   * Correo electrónico para la nueva cuenta
   * @example "juan.perez@correo.com"
   */
  email: string;

  /**
   * Contraseña de seguridad que el usuario desea asignar a su cuenta
   * @example "MiClaveSuperSegura2026!"
   */
  password: string;

  /**
   * Primer nombre o nombres del usuario
   * @example "Juan Carlos"
   */
  firstName: string;

  /**
   * Apellido o apellidos del usuario
   * @example "Pérez"
   */
  lastName: string;
}
