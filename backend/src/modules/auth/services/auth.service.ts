// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Errores personalizados para la gestión controlada de excepciones de negocio
import { NotFoundError, ConflictError } from "../../../shared/errors/index.js"; 

// Repositorios encargados del acceso físico a los datos (Auth y Usuarios)
import { AuthRepository } from "../repositories/auth.repository.js"; 
import { UserRepository } from "../../users/repositories/user.repository.js"; 

// Contratos estructurales de transferencia de datos de entrada (DTOs)
import type { RegisterDTO } from "../dto/register.dto.js"; 
import type { LoginDTO } from "../dto/login.dto.js"; 

// ==========================================
// CAPA DE LÓGICA DE NEGOCIO (AUTH SERVICE)
// ==========================================

/**
 * Servicio de Autenticación
 * 
 * Orquestador principal de las reglas de negocio vinculadas a las cuentas de usuario,
 * controlando los flujos de validación de identidad, altas en el sistema e inicio de sesiones.
 */
export class AuthService {
  
  constructor(
    // Inyección de dependencias: Inicializa los repositorios de datos requeridos por el servicio
    private readonly authRepository = new AuthRepository(),
    private readonly userRepository = new UserRepository(),
  ) {}

  /**
   * Obtiene el Perfil del Usuario Autenticado
   * 
   * Solicita al repositorio la información del usuario mediante su ID único.
   * Si no se encuentra ningún registro coincidente, dispara una excepción controlada.
   * 
   * @param {string} authId - Identificador único de autenticación del usuario.
   * @throws {NotFoundError} Si el ID especificado no corresponde a ninguna cuenta en el sistema.
   * @returns {Promise<{ user: any }>} Envoltorio con el perfil del usuario recuperado.
   */
  async getCurrentUser(authId: string) {
    // 1. Consulta la base de datos interna buscando la identidad del usuario
    const user = await this.userRepository.findById(authId);

    // 2. Si el registro no existe en el sistema, corta el flujo con un error 404 estructurado
    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado",
        "USER_NOT_FOUND",
      );
    }

    // 3. Retorna el perfil encapsulado de manera limpia
    return {
      user,
    };
  }

  /**
   * Procesa el Registro de un Nuevo Usuario
   * 
   * Evalúa de forma preventiva si el correo electrónico ya se encuentra registrado.
   * Si está libre, procede con la llamada al repositorio para crear la cuenta.
   * 
   * @param {RegisterDTO} data - Datos de perfil y credenciales proporcionados por el cliente.
   * @throws {ConflictError} Si el correo ya pertenece a un usuario existente en la plataforma.
   * @returns {Promise<{ user: any }>} Envoltorio con el nuevo perfil creado con éxito.
   */
  async register(data: RegisterDTO) {
    // 1. Validación preventiva de negocio: Comprueba si el email ya existe en la BD interna
    const exists = await this.userRepository.existsByEmail(
      data.email,
    );

    // 2. Si la cuenta ya existe, impide el registro arrojando un error de conflicto 409
    if (exists) {
      throw new ConflictError(
        "El usuario ya existe",
        "USER_ALREADY_EXISTS",
      );
    }

    // 3. Si el correo está libre, delega la creación física de la cuenta al repositorio de Auth
    const user = await this.authRepository.createUser(data);

    return {
      user,
    };
  }

  /**
   * Ejecuta el Inicio de Sesión (Login)
   * 
   * Delega directamente la verificación de credenciales y la generación de tokens
   * al repositorio especializado de autenticación.
   * 
   * @param {LoginDTO} data - Credenciales de acceso (email y contraseña).
   * @returns {Promise<any>} Datos combinados de la sesión y el perfil del usuario.
   */
  async login(data: LoginDTO) {
    // Redirección directa hacia la lógica física de login en Supabase
    return this.authRepository.login(data);
  }
}
