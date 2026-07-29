// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipados oficiales de Fastify para el ciclo de solicitud y respuesta HTTP
import type { FastifyReply, FastifyRequest } from "fastify"; 

// Servicio que contiene la lógica de negocio para la autenticación
import { AuthService } from "../services/auth.service.js"; 

// Esquemas de validación Zod para asegurar la estructura de los datos entrantes
import { registerSchema } from "../schemas/register.schema.js"; 
import { loginSchema } from "../schemas/login.schema.js"; 

// ==========================================
// CONTROLADOR DE AUTENTICACIÓN (AUTH CONTROLLER)
// ==========================================

/**
 * Controlador de Autenticación
 * 
 * Intercepta las solicitudes HTTP del módulo de autenticación, procesa las entradas del cliente,
 * invoca los servicios del sistema y estructura las respuestas HTTP salientes.
 */
export class AuthController {
  
  constructor(
    // Inyección de dependencias: Inicializa el servicio de autenticación para su uso interno
    private readonly authService = new AuthService(),
  ) {}

  /**
   * Registro de Nuevos Usuarios
   * 
   * Extrae el cuerpo de la petición, lo valida estructuralmente contra el esquema de registro,
   * delega la creación en Supabase/BD y retorna un estado 201 (Creado).
   * 
   * @param {FastifyRequest} request - Objeto de la petición HTTP entrante.
   * @param {FastifyReply} reply - Objeto de respuesta HTTP de Fastify.
   */
  async register(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    // 1. Valida de forma estricta que el cuerpo cumpla con los requisitos (email válido, password seguro, etc.)
    const data = registerSchema.parse(request.body);

    // 2. Ejecuta la lógica de registro a través del servicio dedicado
    const result = await this.authService.register(data);

    // 3. Envía una respuesta estructurada con código de éxito HTTP 201 (Created)
    return reply
      .status(201)
      .send({
        success: true,
        data: result,
      });
  }

  /**
   * Inicio de Sesión de Usuarios (Login)
   * 
   * Valida las credenciales recibidas en el body, solicita el token de sesión 
   * al servicio y responde con un código HTTP 200 junto con los datos de acceso.
   * 
   * @param {FastifyRequest} request - Objeto de la petición HTTP entrante.
   * @param {FastifyReply} reply - Objeto de respuesta HTTP de Fastify.
   */
  async login(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    // 1. Valida estructuralmente el par de credenciales (email y password) entregados
    const data = loginSchema.parse(request.body);

    // 2. Invoca el servicio para autenticar al usuario y generar sus llaves de sesión
    const result = await this.authService.login(data);

    // 3. Responde de forma exitosa con un estado HTTP 200 (OK)
    return reply
      .status(200)
      .send({
        success: true,
        data: result,
      });
  }

  /**
   * Obtener Perfil del Usuario Autenticado (Session Profile)
   * 
   * Recupera la identidad del usuario actual adjunta previamente en la petición (mediante el middleware JwtVerifier)
   * y consulta sus detalles completos en el sistema.
   * 
   * @param {FastifyRequest} request - Objeto de la petición HTTP entrante (Debe incluir 'user').
   * @param {FastifyReply} reply - Objeto de respuesta HTTP de Fastify.
   */
  async me(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    // 1. Obtiene el ID del usuario directamente del token previamente verificado
    // El operador '!' le indica a TypeScript que estamos seguros de que 'request.user' no es nulo debido a la protección de la ruta
    const result = await this.authService.getCurrentUser(
      request.user!.id,
    );

    // 2. Devuelve los detalles del perfil con un estado HTTP 200 (OK)
    return reply
      .status(200)
      .send({
        success: true,
        data: result,
      });
  }
}
