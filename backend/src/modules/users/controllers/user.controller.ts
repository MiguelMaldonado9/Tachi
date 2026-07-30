// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipados estructurales oficiales de Fastify para el ciclo de solicitud y respuesta HTTP
import type { FastifyReply, FastifyRequest } from "fastify"; 

// Servicio que contiene las reglas de negocio para la gestión de usuarios
import { UserService } from "../services/user.service.js"; 

// Esquema de validación Zod para asegurar la estructura de la actualización de perfil
import { updateProfileSchema } from "../schemas/update-profile.schema.js"; 

// Esquema de validación Zod para asegurar la estructura del cambio de contraseña
import { changePasswordSchema } from "../schemas/change-password.schema.js"; 

// Tipado inferido automático a partir del esquema de validación de perfil
import type { UpdateProfileDTO } from "../dto/update-profile.dto.js";

// ==========================================
// CONTROLADOR DE USUARIOS (USER CONTROLLER)
// ==========================================

/**
 * Controlador de Usuarios
 * 
 * Intercepta las solicitudes HTTP del módulo de usuarios, procesa los parámetros del cliente,
 * valida las entradas mediante esquemas y delega la ejecución en las capas de servicio.
 */
export class UserController {
  
  constructor(
    // Inyección de dependencias: Inicializa el servicio de usuarios para consumo interno
    private readonly userService = new UserService(),
  ) {}

  /**
   * Obtener Información del Usuario Actual
   * 
   * Recupera la identidad del token verificado por el middleware y consulta
   * el perfil completo del usuario, retornando un código de estado HTTP 200 (OK).
   * 
   * @param {FastifyRequest} request - Objeto de la petición HTTP (Incluye 'request.user').
   * @param {FastifyReply} reply - Objeto de respuesta de Fastify.
   */
  async me(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    // 1. Invoca al servicio de negocio utilizando el ID inyectado de forma segura por el token [2026-07-29]
    // El operador '!' garantiza a TypeScript que 'request.user' existe gracias al middleware 'authenticate' [2026-07-29]
    const result = await this.userService.getProfile(
      request.user!.id,
    );

    // 2. Envía una respuesta estandarizada y exitosa con código HTTP 200
    return reply
      .status(200)
      .send({
        success: true,
        data: result,
      });
  }

  /**
   * Actualizar Datos del Perfil del Usuario
   * 
   * Valida estructuralmente el cuerpo de la petición con Zod y envía los campos
   * editables junto con la identidad del token hacia la capa de servicio.
   * 
   * @param {FastifyRequest} request - Objeto de la petición HTTP (Contiene el cuerpo y el usuario).
   * @param {FastifyReply} reply - Objeto de respuesta de Fastify.
   */
  async updateProfile(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    // 1. Valida de forma física en tiempo de ejecución que el cuerpo cumpla las reglas del esquema [2026-07-29]
    const data = updateProfileSchema.parse(
      request.body,
    );

    // 2. Transfiere el ID del usuario autenticado y los datos validados al servicio core [2026-07-29]
    const result = await this.userService.updateProfile(
      request.user!.id,
      data,
    );

    // 3. Responde exitosamente confirmando la actualización del recurso (HTTP 200)
    return reply
      .status(200)
      .send({
        success: true,
        data: result,
      });
  }

    /**
   * Cambiar Contraseña del Usuario Autenticado
   * 
   * Valida estructuralmente el cuerpo de la petición mediante el esquema de cambio de clave,
   * extrae la identidad del token de sesión seguro y delega la actualización en el servicio.
   * 
   * @param {FastifyRequest} request - Objeto de la petición HTTP (Contiene el cuerpo con las claves).
   * @param {FastifyReply} reply - Objeto de respuesta de Fastify.
   */
  async changePassword(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    // 1. Valida físicamente que los campos del body cumplan con las reglas de Zod (longitud, textos) [2026-07-29]
    const data = changePasswordSchema.parse(
      request.body,
    );

    // 2. Transfiere el ID seguro del token y las contraseñas procesadas a la capa de negocio [2026-07-29]
    // Se añade '!' para asegurar a TypeScript que 'user' existe gracias a la protección del middleware [2026-07-29]
    const result = await this.userService.changePassword(
      request.user!.id,
      data,
    );

    // 3. Responde exitosamente confirmando la actualización de las credenciales (HTTP 200)
    return reply
      .status(200)
      .send({
        success: true,
        data: result,
      });
  }

}
