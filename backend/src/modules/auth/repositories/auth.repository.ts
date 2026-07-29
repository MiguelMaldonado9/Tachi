// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Instancia global unificada del proveedor de Supabase (con clientes Admin y Client)
import { supabase } from "../../../lib/supabase/index.js"; 

// Errores personalizados del sistema para manejo de excepciones controlado
import { 
  ConflictError, 
  InternalServerError, 
  UnauthorizedError 
} from "../../../shared/errors/index.js"; 

// Contratos estructurales de transferencia de datos (DTOs)
import type { UserDTO } from "../../users/dto/user.dto.js"; 
import type { RegisterDTO } from "../dto/register.dto.js"; 
import type { LoginDTO } from "../dto/login.dto.js"; 
import type { LoginResponseDTO } from "../dto/login-response.dto.js"; 

// Enumerador de estados de usuario definidos en el módulo de autenticación
import { UserStatus } from "../types/auth.types.js"; 

// Repositorio hermano encargado del acceso y persistencia de usuarios en BD
import { UserRepository } from "../../users/repositories/user.repository.js"; 

// ==========================================
// REPOSITORIO DE AUTENTICACIÓN (AUTH REPOSITORY)
// ==========================================

/**
 * Repositorio de Autenticación
 * 
 * Centraliza las operaciones físicas de acceso e identidad contra Supabase Auth.
 * Administra tanto la creación administrativa de cuentas como el inicio de sesión del cliente.
 */
export class AuthRepository {
  // Inyección de dependencias: Instancia el repositorio de usuarios para operaciones de sincronización
  private readonly userRepository = new UserRepository();

  /**
   * Crea un Nuevo Usuario de forma Administrativa
   * 
   * Registra las credenciales en Supabase Auth forzando la confirmación de email, 
   * inyecta los metadatos iniciales y verifica su existencia inmediata en el sistema.
   * 
   * @param {RegisterDTO} data - Datos del formulario de registro enviados por el cliente.
   * @throws {ConflictError} Si el correo electrónico ya se encuentra en uso por otra cuenta.
   * @throws {InternalServerError} Si ocurre un error inesperado de red o de base de datos.
   * @returns {Promise<UserDTO>} El perfil de usuario verificado y creado.
   */
  async createUser(data: RegisterDTO): Promise<UserDTO> {
    // 1. Registra el usuario usando el cliente de administración para saltar flujos de confirmación manuales
    const { data: authUser, error } = await supabase.admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Confirma el correo automáticamente (ideal para agilizar flujos)
      user_metadata: {
        full_name: `${data.firstName} ${data.lastName}`, // Almacena el nombre completo en los metadatos de Supabase
      },
    });

    // 2. Control de errores devueltos por el SDK de Supabase
    if (error) {
      if (error.message.includes("already been registered")) {
        throw new ConflictError(
          "El correo ya está registrado",
          "EMAIL_ALREADY_EXISTS",
        );
      }
      throw new InternalServerError(error.message);
    }

    // 3. Sincronización: Busca el usuario recién creado usando su repositorio nativo
    const user = await this.userRepository.findById(authUser.user.id);

    // 4. Si la base de datos no arroja el registro correspondiente, lanza una excepción de sistema
    if (!user) {
      throw new InternalServerError(
        "No fue posible obtener el usuario creado.",
      );
    }

    return user;
  }

  /**
   * Inicio de Sesión de Usuarios
   * 
   * Valida el par email/contraseña directamente contra las políticas cliente de Supabase,
   * recupera la sesión activa y retorna el paquete completo con el DTO del perfil e información del token.
   * 
   * @param {LoginDTO} data - Credenciales de acceso proporcionadas por el usuario.
   * @throws {UnauthorizedError} Si las credenciales son incorrectas o inválidas.
   * @throws {InternalServerError} Si el usuario no existe en la base de datos interna de la app.
   * @returns {Promise<LoginResponseDTO>} Datos combinados de perfil y tokens de sesión.
   */
  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    // 1. Ejecuta la solicitud de inicio de sesión utilizando el cliente público (.client)
    const { data: sessionData, error } = await supabase.client.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    // 2. Verifica si hubo un error o si el paquete de sesión llegó incompleto
    if (error || !sessionData.user || !sessionData.session) {
      throw new UnauthorizedError(
        "Correo o contraseña incorrectos.",
        "INVALID_CREDENTIALS",
      );
    }

    // 3. Busca el perfil asociado en nuestro almacén interno mediante el ID único de autenticación
    const user = await this.userRepository.findById(sessionData.user.id);

    // 4. Asegura que el usuario autenticado exista en la base de datos de negocio
    if (!user) {
      throw new InternalServerError(
        "Usuario no encontrado después del login.",
      );
    }

    // 5. Mapea y retorna la respuesta con las llaves tipadas correctamente según el SessionDTO
    return {
      user,
      session: {
        accessToken: sessionData.session.access_token,
        refreshToken: sessionData.session.refresh_token,
        expiresIn: sessionData.session.expires_in,
      },
    };
  }
}
