// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Librería 'jose' para el manejo y verificación segura de firmas de tokens JWT y llaves JWKS
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose"; 

// Variables de entorno validadas del sistema
import { env } from "../../config/index.js"; 

// Tipado estructural del usuario que se inyectará en las peticiones autenticadas
import type { CurrentUser } from "../../modules/auth/types/current-user.js"; 

// Error personalizado del sistema para accesos no autorizados
import { UnauthorizedError } from "../../shared/errors/index.js"; 

// ==========================================
// VERIFICADOR DE TOKENS JWT (JWT VERIFIER)
// ==========================================

/**
 * Verificador de Tokens de Seguridad JWT
 * 
 * Se conecta de forma remota con Supabase para obtener las llaves públicas criptográficas (JWKS).
 * Valida de forma estricta la firma, vigencia y emisor de cada token enviado por los clientes.
 */
export class JwtVerifier {
  // Almacén en memoria de las llaves públicas remotas obtenidas de Supabase
  private readonly jwks;

  constructor() {
    // 1. Configura el conjunto de llaves públicas remotas (JWKS)
    // Apunta al endpoint estándar de Supabase que expone las firmas criptográficas del proyecto
    this.jwks = createRemoteJWKSet(
      new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
    );
  }

  /**
   * Verifica la Validez de un Token JWT
   * 
   * Toma el token en texto plano, comprueba criptográficamente su firma usando el JWKS,
   * valida que el emisor (issuer) coincida y mapea la información útil si todo es correcto.
   * 
   * @param {string} token - El token JWT enviado en la cabecera 'Authorization'.
   * @throws {UnauthorizedError} Si el token fue alterado, expiró o el emisor no coincide.
   * @returns {Promise<CurrentUser>} Datos del usuario autenticado mapeados para el sistema.
   */
  async verify(token: string): Promise<CurrentUser> {
    try {
      // 2. Realiza la verificación criptográfica estricta del token
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: env.SUPABASE_JWT_ISSUER, // Valida que el token provenga exactamente de tu Supabase
      });

      // 3. Si pasa la validación, procesa y limpia la carga útil (payload)
      return this.mapPayload(payload);
    } catch {
      // 4. Captura cualquier fallo de firma o expiración y lanza un error controlado
      throw new UnauthorizedError(
        "Token inválido o expirado",
        "INVALID_TOKEN",
      );
    }
  }

  /**
   * Mapeador de Carga Útil (Payload Mapper)
   * 
   * Extrae los datos nativos del JWT de Supabase y los adapta a la estructura
   * interna de usuario que maneja el backend.
   * 
   * @param {JWTPayload} payload - Datos crudos extraídos del token validado.
   * @returns {CurrentUser} Objeto estructurado con la información del usuario actual.
   */
  private mapPayload(payload: JWTPayload): CurrentUser {
    return {
      id: payload.sub ?? "",                  // ID único del usuario (Subject) en Supabase
      email: String(payload.email ?? ""),     // Correo electrónico del usuario
      roles: [],                              // Inicializa un arreglo vacío para manejo futuro de permisos
    };
  }
}

// ==========================================
// EXPORTACIÓN DE LA INSTANCIA ÚNICA (SINGLETON)
// ==========================================

/**
 * Instancia global unificada del verificador JWT.
 * Permite validar tokens en cualquier middleware o ruta compartiendo el mismo caché de llaves JWKS.
 */
export const jwtVerifier = new JwtVerifier();
