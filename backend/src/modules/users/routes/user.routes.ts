// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipados oficiales del framework Fastify
import type { FastifyInstance } from "fastify"; 

// Controlador que gestionará las solicitudes físicas de este módulo
import { UserController } from "../controllers/user.controller.js"; 

// Middleware encargado de validar el token de sesión Bearer en rutas protegidas [2026-07-29]
import { authenticate } from "../../middleware/authenticate.js"; 

// ==========================================
// DEFINICIÓN DE ENRUTAMIENTO MODULAR (USERS)
// ==========================================

/**
 * Enrutador Modular de Usuarios
 * 
 * Registra todos los endpoints dedicados a la lectura y actualización de los
 * perfiles de usuario. Todas las rutas se configuran bajo protección estricta.
 * 
 * @param {FastifyInstance} app - Sub-instancia del servidor Fastify (aislada por prefijo).
 */
export async function userRoutes(
  app: FastifyInstance,
) {
  // Instancia el controlador encargado de resolver las operaciones de negocio del módulo
  const controller = new UserController();

  // 1. Endpoint para Obtener Perfil del Usuario Autenticado
  // Recupera la información completa de la cuenta vinculada al token actual
  app.get(
    "/me",
    {
      // Gancho de ejecución previa: Exige y valida un token de sesión antes de dar acceso [2026-07-29]
      preHandler: authenticate, 
    },
    controller.me.bind(controller), // .bind asegura que los métodos conserven el contexto interno 'this' [2026-07-29]
  );

  // 2. Endpoint para Actualizar Datos del Perfil
  // Modifica parcialmente los campos públicos del usuario (nombre, teléfono, foto)
  app.patch(
    "/profile",
    {
      // Gancho de ejecución previa: Protege el endpoint contra accesos anónimos
      preHandler: authenticate, 
    },
    controller.updateProfile.bind(controller),
  );

  // 3. Endpoint para Cambiar Contraseña
  app.patch(
    "/password",
    {
      preHandler: authenticate,
    },
    controller.changePassword.bind(controller),
  );
}
