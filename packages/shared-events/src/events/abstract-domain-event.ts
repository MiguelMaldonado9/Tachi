// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Enumerador global con los nombres permitidos de todos los eventos del sistema
import type { DomainEventName } from "./domain-event-name.js"; 

// Módulo nativo de Node.js utilizado para la generación segura de identificadores UUID
import { randomUUID } from "node:crypto"; 

// Interfaz del contrato general que debe cumplir cualquier evento de dominio
import type { DomainEvent } from "./domain-event.js"; 

// ==========================================
// CLASE ABSTRACTA BASE (ABSTRACT DOMAIN EVENT)
// ==========================================

/**
 * Clase Abstracta Base para Eventos de Dominio
 * 
 * Implementa la interfaz 'DomainEvent' y sirve como plantilla obligatoria para la creación
 * de cualquier evento en el sistema. Automatiza el registro de metadatos críticos
 * como el identificador único del evento y el momento exacto en el que ocurrió.
 * 
 * @template TPayload - Estructura personalizada de los datos útiles que transportará el evento.
 */
export abstract class AbstractDomainEvent<TPayload = unknown>
  implements DomainEvent<TPayload>
{
  /** Identificador único global (UUID v4) generado automáticamente para auditar este evento específico */
  public readonly eventId: string;

  /** Marca de tiempo exacta que registra la fecha y hora en la que se instanció el evento */
  public readonly occurredAt: Date;

  constructor(
    /** ID del agregado o entidad del negocio que disparó el evento (ej. el ID del viaje) */
    public readonly aggregateId: string,
    
    /** Nombre clave clasificado del evento dentro del ecosistema del monorrepo */
    public readonly eventName: DomainEventName,
    
    /** Carga útil tipada que contiene toda la información de negocio necesaria para los suscriptores */
    public readonly payload: TPayload,
  ) {
    // Genera un identificador único criptográfico al momento del nacimiento del evento
    this.eventId = randomUUID();
    
    // Captura la fecha y hora exacta del sistema en la ejecución
    this.occurredAt = new Date();
  }
}
