// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Clase abstracta base que provee los metadatos y la estructura estándar (ID, fecha)
import { AbstractDomainEvent } from "./abstract-domain-event.js"; 

// Catálogo maestro de nombres para clasificar este evento en el sistema
import { DomainEventName } from "./domain-event-name.js"; 

// ==========================================
// CONTRATOS Y ESTRUCTURAS DE DATOS (PAYLOAD)
// ==========================================

/**
 * Carga Útil del Viaje Solicitado (TripRequestedPayload)
 * 
 * Interfaz que define de forma estricta los datos mínimos de negocio que deben 
 * acompañar al evento cada vez que un pasajero requiera una unidad de movilidad.
 */
export interface TripRequestedPayload {
  /** Identificador único del pasajero que está pidiendo el servicio */
  passengerId: string;
  
  /** Dirección, coordenadas o nombre del punto de partida */
  origin: string;
  
  /** Dirección, coordenadas o nombre del punto de destino final */
  destination: string;
}

// ==========================================
// CLASE DE EVENTO CONCRETO (TRIP REQUESTED EVENT)
// ==========================================

/**
 * Evento de Viaje Solicitado (TripRequestedEvent)
 * 
 * Clase que representa el suceso físico de un pasajero solicitando un viaje.
 * Al instanciarse, inyecta automáticamente el nombre clave del catálogo, el ID del viaje
 * como el identificador del agregado y los datos estructurados del origen y destino.
 */
export class TripRequestedEvent extends AbstractDomainEvent<TripRequestedPayload> {
  
  constructor(
    tripId: string,                  // ID único generado para la transacción de este viaje (aggregateId)
    payload: TripRequestedPayload,   // Paquete con la información del pasajero, origen y destino
  ) {
    // Invoca al constructor de 'AbstractDomainEvent' pasando el ID del viaje,
    // el nombre oficial del evento y la información útil fuertemente tipada.
    super(
      tripId,
      DomainEventName.TRIP_REQUESTED,
      payload,
    );
  }
}
