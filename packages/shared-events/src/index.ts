// ==========================================
// EXPORTACIONES CENTRALIZADAS (BARREL FILE)
// ==========================================

/**
 * Punto de Entrada Público del Paquete Shared Events
 * 
 * Expone de manera centralizada toda la infraestructura, contratos e implementaciones
 * del sistema orientado a eventos hacia los demás paquetes de tu monorrepo Tachi.
 * 
 * Este archivo permite que otros módulos, como tu backend, importen cualquier herramienta 
 * de mensajería apuntando simplemente a la raíz del paquete "@tachi/shared-events".
 */

// Exporta la interfaz estructural base de los eventos de dominio
export * from "./events/domain-event.js";

// Exporta el catálogo maestro con los nombres oficiales de todos los eventos
export * from "./events/domain-event-name.js";

// Exporta la plantilla base automatizada para la creación de nuevos eventos
export * from "./events/abstract-domain-event.js";

// Exporta el tipo que define la firma estándar de las funciones oyentes (handlers)
export * from "./handlers/event-handler.js";

// Exporta el contrato arquitectónico general de tu bus de mensajería
export * from "./bus/event-bus.js";

// Exporta la implementación concreta del bus local distribuido en memoria RAM
export * from "./implementations/in-memory-event-bus.js";

// Exporta la clase del evento concreto que notifica la solicitud de un viaje por un pasajero
export * from "./events/trip-requested.event.js";
