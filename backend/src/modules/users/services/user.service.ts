// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Excepción controlada del sistema para registros inexistentes (HTTP 404)
import { NotFoundError } from "../../../shared/errors/index.js"; 

// Repositorio encargado del acceso físico a los datos de la tabla 'users'
import { UserRepository } from "../repositories/user.repository.js"; 

// Contrato de transferencia de datos para la actualización de perfil
import type { UpdateProfileDTO } from "../dto/update-profile.dto.js"; 

// Contrato de transferencia de datos para el cambio de contraseña
import type { ChangePasswordDTO } from "../dto/change-password.dto.js";

// Repositorio encargado del acceso físico a los datos de la tabla 'auth'
import { AuthRepository } from "../../auth/repositories/auth.repository.js";


// ==========================================
// CAPA DE LÓGICA DE NEGOCIO (USER SERVICE)
// ==========================================

/**
 * Servicio de Usuarios
 * 
 * Orquestador de las reglas de negocio vinculadas a la gestión de perfiles,
 * controlando la lectura de cuentas y aplicando candados preventivos antes
 * de autorizar modificaciones de información en el sistema.
 */
export class UserService {
  
  constructor(
    // Inyección de dependencias: Inicializa el repositorio de datos para operaciones internas
    private readonly userRepository = new UserRepository(),

    // Inyección de dependencias: Inicializa el repositorio de autenticación para operaciones internas
    private readonly authRepository = new AuthRepository(),
  ) {}

  /**
   * Obtiene el Perfil Completo de un Usuario por ID
   * 
   * Solicita al repositorio la información del usuario mediante su identificador.
   * Si no se localiza el registro, corta el flujo con una excepción controlada 404.
   * 
   * @param {string} id - Identificador único del usuario (UUID).
   * @throws {NotFoundError} Si el ID especificado no corresponde a ninguna cuenta activa.
   * @returns {Promise<{ user: any }>} Envoltorio limpio con el DTO del perfil recuperado.
   */
  async getProfile(
    id: string,
  ) {
    // 1. Consulta la base de datos a través del repositorio buscando al usuario
    const user = await this.userRepository.findById(id);

    // 2. Candado de seguridad: Si el usuario no existe, detiene el proceso con un error estructurado
    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado",
        "USER_NOT_FOUND",
      );
    }

    // 3. Retorna el perfil encapsulado correctamente
    return {
      user,
    };
  }

  /**
   * Actualiza el Perfil de un Usuario Existente
   * 
   * Evalúa de forma preventiva si la cuenta existe físicamente en el sistema.
   * Si es afirmativo, delega la persistencia de los nuevos datos al repositorio.
   * 
   * @param {string} id - Identificador único del usuario a modificar (UUID).
   * @param {UpdateProfileDTO} data - Objeto de transferencia con los campos editables limpios.
   * @throws {NotFoundError} Si se intenta actualizar una cuenta que ya no existe en el sistema.
   * @returns {Promise<{ user: any }>} Envoltorio con el nuevo perfil actualizado con éxito.
   */
  async updateProfile(
    id: string,
    data: UpdateProfileDTO,
  ) {
    // 1. Validación preventiva de negocio: Comprueba la existencia física del ID en la BD [2026-07-29]
    const exists = await this.userRepository.existsById(id);

    // 2. Si la cuenta no existe, impide la modificación arrojando una excepción 404
    if (!exists) {
      throw new NotFoundError(
        "Usuario no encontrado",
        "USER_NOT_FOUND",
      );
    }

    // 3. Si pasa el control, invoca el método físico de actualización en el repositorio
    const user = await this.userRepository.updateProfile(
      id,
      data,
    );

    return {
      user,
    };
  }

    /**
   * Procesa el Cambio de Contraseña de un Usuario
   * 
   * Método de negocio encargado de recibir las credenciales, validar las políticas
   * internas de actualización y comunicarse con los servicios de autenticación de Supabase.
   * 
   * @param {string} userId - Identificador único del usuario autenticado (UUID).
   * @param {ChangePasswordDTO} data - Objeto de transferencia con la clave actual y la nueva.
   * @throws {Error} Lanza una excepción temporal indicando que el método está en desarrollo.
   */
  async changePassword(
    userId: string,
    data: ChangePasswordDTO,
  ) {

    const user=
      await this.userRepository.findById(userId);

      if (!user) {
        throw new NotFoundError(
          "Usuario no encontrado",
          "USER_NOT_FOUND",
        );
      }

      await this.authRepository.changePassword(
        user.email,
        data.currentPassword,
        data.newPassword,
      );

      return {

        message: "Contraseña actualizada con exito",
      }

    // Lanzamiento preventivo de error para alertar al sistema que la lógica está pendiente de construcción
    throw new Error(
      "Método changePassword no implementado.",
    );
  }

}
