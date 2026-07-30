// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipados oficiales de Fastify
import { FastifyInstance } from "fastify"; 

// Enrutador modular para el módulo de Autenticación
import { authRoutes } from "../modules/auth/index.js"; 

// Enrutador modular para el módulo de Usuarios
import { userRoutes } from "../modules/users/index.js";

// ==========================================
// REGISTRO DE RUTAS DEL SISTEMA
// ==========================================

/**
 * Registro Central de Rutas de la API
 * 
 * Define los endpoints globales del sistema y acopla los módulos
 * secundarios (como autenticación, usuarios, etc.) bajo sus respectivos prefijos.
 * 
 * @param {FastifyInstance} app - Instancia del servidor Fastify en desarrollo.
 */
export async function registerRoutes(app: FastifyInstance) {
  
  // 1. Endpoint de Monitoreo (Health Check)
  // Sirve para verificar si el servidor está vivo y respondiendo correctamente
  app.get("/health", async () => {
    return {
      status: "ok",                          // Estado operativo del servidor
      service: "tachi-backend",              // Nombre del backend del proyecto
      version: "0.1.0",                      // Versión actual del software
      timestamp: new Date().toISOString(),   // Fecha y hora del servidor en formato UTC
    };
  });

  // 2. Registro del Módulo de Autenticación
  // Agrupa todas las rutas de auth (login, register, etc.) bajo el prefijo "/auth"
  // Ejemplo: si authRoutes tiene un endpoint "/login", la ruta final será "/auth/login"
  await app.register(authRoutes, {
    prefix: "/auth",
  });

  // 3. Registro del Módulo de Usuarios
  // Agrupa todas las rutas de users (register, login, etc.) bajo el prefijo "/users"
  // Ejemplo: si userRoutes tiene un endpoint "/register", la ruta final será "/users/register"
  await app.register(userRoutes, {
    prefix: "/users",
  });
}
