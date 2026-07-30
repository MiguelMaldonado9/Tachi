// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Instancia global unificada del proveedor de Supabase
import { supabase } from "../../../lib/supabase/index.js"; 

// Excepción controlada del sistema para fallos internos del servidor
import { InternalServerError } from "../../../shared/errors/index.js"; 

// Contrato de transferencia de datos para perfiles de usuario
import type { UserDTO } from "../dto/user.dto.js"; 

// Enumerador de estados de usuario definidos en el módulo de autenticación
import { UserStatus } from "../../auth/types/auth.types.js"; 

// Contrato de transferencia de datos para actualización de perfiles
import type { UpdateProfileDTO }
  from "../dto/update-profile.dto.js";

// ==========================================
// CONFIGURACIÓN DE CONSULTAS Y TIPADOS LOCALES
// ==========================================

// Cadena de selección reutilizable para mapear las columnas exactas de la tabla en Supabase
const USER_SELECT = `
  id,
  email,
  full_name,
  phone,
  photo_url,
  status
`;

// Tipo estructural que representa una fila cruda devuelta por la base de datos
type UserRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  photo_url: string | null;
  status: string;
};

// ==========================================
// REPOSITORIO DE USUARIOS (USER REPOSITORY)
// ==========================================

/**
 * Repositorio de Usuarios
 * 
 * Centraliza las consultas de lectura y validaciones de existencia sobre la tabla 
 * física 'users' de Supabase, operando de forma administrativa mediante el cliente '.admin'.
 */
export class UserRepository {
  
  /**
   * Busca un Usuario por su Identificador Único (ID)
   * 
   * @param {string} id - ID único del registro a consultar.
   * @returns {Promise<UserDTO | null>} El perfil mapeado si existe, o null si no se encuentra.
   */
  async findById(
    id: string,
  ): Promise<UserDTO | null> {
    const { data, error } = await supabase.admin
      .from("users")
      .select(USER_SELECT)
      .eq("id", id)
      .maybeSingle(); // Retorna un registro o null de forma limpia sin lanzar errores por ausencia

    if (error || !data) {
      return null;
    }

    return this.mapUser(data);
  }

  /**
   * Busca un Usuario por su Dirección de Correo Electrónico
   * 
   * @param {string} email - Correo electrónico de la cuenta a buscar.
   * @returns {Promise<UserDTO | null>} El perfil mapeado si existe, o null si no se encuentra.
   */
  async findByEmail(
    email: string,
  ): Promise<UserDTO | null> {
    const { data, error } = await supabase.admin
      .from("users")
      .select(USER_SELECT)
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return this.mapUser(data);
  }

  /**
   * Verifica la Existencia de un Correo Electrónico (Optimizado)
   * 
   * Realiza una consulta ultraligera en red solicitando únicamente el conteo exacto
   * de coincidencias sin descargar el cuerpo de las filas.
   * 
   * @param {string} email - Correo electrónico a evaluar.
   * @throws {InternalServerError} Si el motor de la base de datos devuelve un fallo de red.
   * @returns {Promise<boolean>} Verdadero si el correo ya está registrado, falso de lo contrario.
   */
  async existsByEmail(
    email: string,
  ): Promise<boolean> {
    const { count, error } = await supabase.admin
      .from("users")
      .select(
        "id",
        {
          count: "exact", // Solicita el cómputo exacto de registros coincidentes
          head: true,    // Habilita el modo HEAD: no descarga datos, solo responde con las cabeceras/conteos
        },
      )
      .eq("email", email);

    if (error) {
      throw new InternalServerError(
        error.message,
      );
    }

    return (count ?? 0) > 0;
  }

  /**
   * Verifica la Existencia de un ID de Usuario (Optimizado)
   * 
   * @param {string} id - ID único a evaluar.
   * @throws {InternalServerError} Si el motor de la base de datos devuelve un fallo de red.
   * @returns {Promise<boolean>} Verdadero si el registro existe, falso de lo contrario.
   */
  async existsById(
    id: string,
  ): Promise<boolean> {
    const { count, error } = await supabase.admin
      .from("users")
      .select(
        "id",
        {
          count: "exact",
          head: true,
        },
      )
      .eq("id", id);

    if (error) {
      throw new InternalServerError(
        error.message,
      );
    }

    return (count ?? 0) > 0;
  }

  /**
   * Actualiza la Información del Perfil de un Usuario
   * 
   * Modifica las columnas editables de la tabla 'users' (nombre, teléfono y URL de la foto)
   * utilizando los permisos administrativos (.admin) para aplicar los cambios basados en su ID único.
   * 
   * @param {string} id - Identificador único del usuario a modificar (UUID).
   * @param {UpdateProfileDTO} data - Objeto de transferencia con los nuevos datos limpios y validados.
   * @throws {InternalServerError} Si ocurre un error inesperado durante la transacción en Supabase.
   * @returns {Promise<UserDTO>} El perfil del usuario actualizado con su nueva estructura completa.
   */
  async updateProfile(
    id: string,
    data: UpdateProfileDTO,
  ): Promise<UserDTO> {
    // 1. Ejecuta la operación UPDATE en Supabase mapeando las propiedades camelCase a snake_case de la BD
    const { data: user, error } = await supabase.admin
      .from("users")
      .update({
        full_name: data.name,
        phone: data.phone,
        photo_url: data.photoUrl,
      })
      .eq("id", id)           // Cláusula de coincidencia: actualiza únicamente el registro con este ID
      .select(USER_SELECT)   // Solicita que retorne de inmediato los campos limpios configurados en la constante USER_SELECT [2026-07-29]
      .single();             // Fuerza a que la respuesta devuelva un solo objeto en lugar de un arreglo

    // 2. Control de errores físicos devueltos por el motor de base de datos
    if (error) {
      throw new InternalServerError(
        error.message,
      );
    }

    // 3. Pasa la fila cruda por el traductor 'mapUser' para retornar el contrato oficial UserDTO [2026-07-29]
    return this.mapUser(user);
  }


  /**
   * Adaptador de Formatos (Traductor Interno)
   * 
   * Transforma una fila plana nativa de la base de datos (UserRow) 
   * en la estructura del contrato de dominio oficial (UserDTO).
   * 
   * @param {UserRow} data - Fila cruda de la tabla de Supabase.
   * @returns {UserDTO} Objeto de transferencia estructurado.
   */
  private mapUser(
    data: UserRow,
  ): UserDTO {
    return {
      id: data.id,
      authId: data.id,
      name: data.full_name, // Mapea la columna snake_case de la BD a camelCase del DTO
      email: data.email,
      phone: data.phone,
      photoUrl: data.photo_url,
      roles: [], //TODO: // Obtener roles desde la tabla user_roles
      status: data.status as UserStatus, // Forzado seguro de tipado para el enumerador de estados
    };
  }
}
