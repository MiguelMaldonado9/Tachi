// ==========================================
// CATALOGO GLOBAL DE EVENTOS DE DOMINIO
// ==========================================

/**
 * Catálogo de Nombres de Eventos de Dominio (DomainEventName)
 * 
 * Diccionario centralizado (Enum) que define los nombres únicos y oficiales 
 * de todas las acciones significativas que ocurren dentro del ecosistema Tachi.
 * 
 * Permite mantener la consistencia entre publicadores y suscriptores, evitando
 * el uso de cadenas de texto libres que puedan causar errores de ortografía.
 */
export enum DomainEventName {
  
  /* ------------------------------------------
     Módulo de Autenticación / Usuarios (Auth)
     ------------------------------------------ */
  USER_REGISTERED = "UserRegistered",         // Un nuevo usuario ha completado su registro
  USER_LOGGED_IN = "UserLoggedIn",           // Un usuario ha iniciado sesión con éxito
  USER_LOGGED_OUT = "UserLoggedOut",         // Un usuario ha cerrado su sesión activa

  /* ------------------------------------------
     Módulo de Conductores (Drivers)
     ------------------------------------------ */
  DRIVER_APPLIED = "DriverApplied",           // Un candidato se ha postulado para ser conductor
  DRIVER_APPROVED = "DriverApproved",         // Un conductor ha sido aprobado administrativamente
  DRIVER_REJECTED = "DriverRejected",         // La postulación de un conductor ha sido rechazada
  DRIVER_ONLINE = "DriverOnline",             // Un conductor se ha puesto en línea para recibir viajes
  DRIVER_OFFLINE = "DriverOffline",           // Un conductor se ha retirado del mapa (fuera de línea)
  DRIVER_LOCATION_UPDATED = "DriverLocationUpdated", // Se ha actualizado la geolocalización de un conductor

  /* ------------------------------------------
     Módulo de Vehículos (Vehicles)
     ------------------------------------------ */
  VEHICLE_REGISTERED = "VehicleRegistered",   // Un nuevo vehículo ha sido registrado en el sistema
  VEHICLE_ASSIGNED = "VehicleAssigned",       // Se ha asignado un vehículo a un conductor específico
  VEHICLE_RELEASED = "VehicleReleased",       // Se ha desvinculado un vehículo de un conductor

  /* ------------------------------------------
     Módulo de Viajes (Trips)
     ------------------------------------------ */
  TRIP_REQUESTED = "TripRequested",           // Un pasajero ha solicitado un nuevo servicio de viaje
  DRIVER_ASSIGNED = "DriverAssigned",         // El sistema le ha asignado un conductor al viaje
  DRIVER_ACCEPTED = "DriverAccepted",         // El conductor ha aceptado realizar el viaje asignado
  DRIVER_ARRIVED = "DriverArrived",           // El conductor ha llegado al punto de partida del pasajero
  TRIP_STARTED = "TripStarted",               // El viaje ha iniciado formalmente con el pasajero a bordo
  TRIP_COMPLETED = "TripCompleted",           // El viaje ha finalizado con éxito en el destino
  TRIP_CANCELLED = "TripCancelled",           // El viaje ha sido cancelado por alguna de las partes

  /* ------------------------------------------
     Módulo de Pagos (Payments)
     ------------------------------------------ */
  PAYMENT_CREATED = "PaymentCreated",         // Se ha generado una orden de cobro para un viaje
  PAYMENT_COMPLETED = "PaymentCompleted",     // El pago ha sido procesado y liquidado con éxito
  PAYMENT_FAILED = "PaymentFailed",           // El intento de cobro en la pasarela de pagos ha fallado

  /* ------------------------------------------
     Módulo de Calificaciones (Ratings)
     ------------------------------------------ */
  RATING_CREATED = "RatingCreated",           // Se ha emitido una calificación (pasajero a conductor o viceversa)

  /* ------------------------------------------
     Módulo de Notificaciones (Notifications)
     ------------------------------------------ */
  NOTIFICATION_SENT = "NotificationSent",     // Se ha despachado una notificación (Push, SMS, Correo) al usuario
}
