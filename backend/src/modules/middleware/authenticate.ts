// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Tipados estructurales oficiales para peticiones y respuestas de Fastify
import type { FastifyReply, FastifyRequest } from "fastify"; 

// Instancia singleton encargada de descifrar y validar criptográficamente los JWT
import { jwtVerifier } from "../../lib/supabase/index.js"; 

// Excepción controlada del sistema para accesos denegados
import { UnauthorizedError } from "../../shared/errors/index.js"; 

// ==========================================
// MIDDLEWARE DE AUTENTICACIÓN (HOOK PREHANDLER)
// ==========================================

/**
 * Middleware de Autenticación Global (authenticate)
 * 
 * Evalúa las cabeceras HTTP de la petición entrante buscando un token Bearer válido.
 * Si el token pasa los controles criptográficos, inyecta los datos del usuario en 
 * el objeto de la solicitud (`request.user`) para que queden disponibles en la ruta.
 * 
 * @param {FastifyRequest} request - Objeto de la petición HTTP entrante.
 * @param {FastifyReply} _reply - Objeto de respuesta (No utilizado, prefijado con guion bajo).
 * @throws {UnauthorizedError} Si el token falta, tiene un formato incorrecto o está expirado.
 */
export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  // 1. Extrae el valor de la cabecera estándar de autorización
  const authorization = request.headers.authorization;

  // 2. Primer candado: Valida que la cabecera exista físicamente en la petición
  if (!authorization) {
    throw new UnauthorizedError(
      "Token requerido",
      "TOKEN_REQUIRED",
    );
  }

  // 3. Segundo candado: Valida que cumpla estrictamente con el estándar de la industria 'Bearer '
  if (!authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "Formato de token inválido",
      "INVALID_TOKEN_FORMAT",
    );
  }

  // 4. Extracción: Remueve la palabra 'Bearer ' (que ocupa exactamente 7 caracteres) para aislar el token puro
  const token = authorization.slice(7);

  // 5. Verificación e inyección de contexto:
  // Pasa el token al verificador de Supabase. Si es válido, asigna el objeto resultante a 'request.user'
  request.user = await jwtVerifier.verify(token);
}
