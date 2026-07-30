// ==========================================
// CONTRATOS DE TRANSFERENCIA DE DATOS (DTO)
// ==========================================

/**
 * Datos de Entrada para Actualizar Perfil (UpdateProfileDTO)
 * 
 * Interfaz que define la estructura obligatoria y los campos permitidos
 * que un usuario puede enviar desde el frontend para modificar la información
 * editable de su cuenta.
 */
export interface UpdateProfileDTO {
  /**
   * Nombre completo o modificado del usuario
   * @example "Juan Carlos Pérez"
   */
  name: string;

  /**
   * Número de teléfono celular actualizado (acepta texto o nulo si decide removerlo)
   * @example "+573001234567"
   */
  phone: string | null;

  /**
   * Dirección URL de la nueva imagen de avatar (acepta texto o nulo si decide eliminar su foto)
   * @example "https://supabase.com"
   */
  photoUrl: string | null;
}
