import type { DomainEventName } from "./domain-event-name.js";

export interface DomainEvent<TPayload = unknown> {
  /**
   * Identificador único del evento.
   */
  readonly eventId: string;

  /**
   * Nombre del evento.
   */
  readonly eventName: DomainEventName;

  /**
   * Identificador de la entidad del dominio
   * sobre la que ocurrió el evento.
   */
  readonly aggregateId: string;

  /**
   * Fecha y hora en la que ocurrió.
   */
  readonly occurredAt: Date;

  /**
   * Información del evento.
   */
  readonly payload: TPayload;
}