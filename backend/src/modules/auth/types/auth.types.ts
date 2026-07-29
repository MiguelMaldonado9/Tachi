// ==========================================
// ENUMERADORES DE NEGOCIO (ENUMS)
// ==========================================

/**
 * Roles de Usuario del Sistema
 * 
 * Determina los niveles de acceso y capacidades operativas de cualquier
 * cuenta registrada dentro de la plataforma.
 */
export enum UserRole {
  PASSENGER = "PASSENGER",   // Usuario cliente que solicita servicios de viaje
  DRIVER = "DRIVER",       // Socio conductor que ofrece servicios de movilidad
  ADMIN = "ADMIN",        // Administrador global con acceso a operaciones de gestión
  SUPERVISOR = "SUPERVISOR", // Personal de soporte con permisos limitados de auditoría
}

/**
 * Estados Generales de la Cuenta de un Usuario
 * 
 * Controla el ciclo de vida y la capacidad de inicio de sesión de cualquier
 * usuario del sistema (común para pasajeros y conductores).
 */
export enum UserStatus {
  PENDING = "PENDING",     // Cuenta creada pero en espera de verificación o activación inicial
  ACTIVE = "ACTIVE",      // Cuenta totalmente operativa y habilitada para usar la plataforma
  SUSPENDED = "SUSPENDED",   // Cuenta inhabilitada temporalmente por comportamiento o deudas
  INACTIVE = "INACTIVE",    // Cuenta desactivada voluntariamente por el propio usuario
  BLOCKED = "BLOCKED",     // Cuenta penalizada permanentemente por infracciones graves de seguridad
}

/**
 * Estados Específicos para Socios Conductores
 * 
 * Gobierna el flujo estricto de auditoría y validación de documentos (licencias,
 * antecedentes, vehículos) requerido antes de que un conductor pueda operar.
 */
export enum DriverStatus {
  PENDING = "PENDING",     // Documentación cargada en revisión por el equipo administrativo
  APPROVED = "APPROVED",    // Conductor verificado y autorizado formalmente para realizar viajes
  REJECTED = "REJECTED",    // Documentación inválida o rechazada (requiere corrección)
  SUSPENDED = "SUSPENDED",   // Permiso de conducción revocado temporalmente en la plataforma
}
