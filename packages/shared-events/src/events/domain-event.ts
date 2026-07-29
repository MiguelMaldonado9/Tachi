// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importación del catálogo unificado con los nombres oficiales de los eventos
import type { DomainEventName } from "./domain-event-name.js"; 

// ==========================================
// CONTRATOS DE ARQUITECTURA (INTERFACES)
// ==========================================

/**
 * Interfaz General de Eventos de Dominio (DomainEvent)
 * 
 * Contrato estructural puro que define la anatomía obligatoria de cualquier 
 * evento que ocurra en el sistema. Asegura que todos los eventos transporten 
 * metadatos de auditoría estandarizados además de su carga útil de negocio.
 * 
 * @template TPayload - Estructura personalizada de los datos de negocio del evento.
 */
export interface DomainEvent<TPayload = unknown> {
  
  /**
   * Identificador único del evento.
   * Útil para tareas de deduplicación y auditoría (Idempotencia).
   */
  readonly eventId: string;

  /**
   * Nombre del evento.
   * Clasifica la acción dentro del catálogo general del sistema.
   */
  readonly eventName: DomainEventName;

  /**
   * Identificador de la entidad del dominio sobre la que ocurrió el evento.
   * Vincula la acción directamente a un registro maestro (ej. ID de un viaje específico).
   */
  readonly aggregateId: string;

  /**
   * Fecha y hora en la que ocurrió.
   * Registra el momento exacto del suceso para ordenamiento cronológico.
   */
  readonly occurredAt: Date;

  /**
   * Información del evento.
   * Contiene los datos útiles e internos específicos que necesitan consumir los oyentes.
   */
  readonly payload: TPayload;
}
