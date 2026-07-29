// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipados oficiales de Fastify
import type { FastifyInstance } from "fastify"; 

// Controlador que maneja las solicitudes de este módulo
import { AuthController } from "../controllers/auth.controller.js"; 

// Middleware encargado de validar la sesión de un usuario en rutas protegidas
import { authenticate } from "../../middleware/authenticate.js"; 

// ==========================================
// DEFINICIÓN DE ENRUTAMIENTO MODULAR (AUTH)
// ==========================================

/**
 * Enrutador Modular de Autenticación
 * 
 * Registra todos los endpoints dedicados a la gestión de accesos, identidades 
 * y perfiles dentro del contexto de la aplicación.
 * 
 * @param {FastifyInstance} app - Sub-instancia del servidor Fastify (aislada por prefijo).
 */
export async function authRoutes(
  app: FastifyInstance,
) {
  // Instancia el controlador encargado de resolver las operaciones de negocio
  const controller = new AuthController();

  // 1. Endpoint para Registro de Usuarios
  // Envía los datos del formulario de registro para dar de alta una nueva cuenta
  app.post(
    "/register",
    controller.register.bind(controller), // .bind asegura que los métodos del controlador mantengan su contexto interno ('this')
  );

  // 2. Endpoint para Inicio de Sesión (Login)
  // Recibe las credenciales (email/password) y genera los tokens de sesión si son válidos
  app.post(
    "/login",
    controller.login.bind(controller),
  );

  // 3. Endpoint para Obtener Perfil Actual (Ruta Protegida)
  // Retorna la información de identidad del usuario actualmente autenticado en el sistema
  app.get(
    "/me",
    {
      // Gancho de ejecución previa: Detiene la petición aquí si el cliente no envía un token válido
      preHandler: authenticate, 
    },
    controller.me.bind(controller),
  );
}
