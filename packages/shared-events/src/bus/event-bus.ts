// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Contrato base para cualquier evento que ocurra dentro del dominio de la app
import type { DomainEvent } from "../events/domain-event.js"; 

// Enumerador global con los nombres permitidos de todos los eventos del sistema
import { DomainEventName } from "../events/domain-event-name.js"; 

// Contrato base para las funciones que van a reaccionar a los eventos (Listeners)
import type { EventHandler } from "../handlers/event-handler.js"; 

// ==========================================
// CONTRATOS DE ARQUITECTURA (INTERFACES)
// ==========================================

/**
 * Interfaz del Bus de Eventos (EventBus)
 * 
 * Contrato arquitectónico central para implementar el patrón Pub/Sub (Publicador/Suscriptor).
 * Define los métodos necesarios para desacoplar la comunicación entre los diferentes
 * módulos de tu monorrepo Tachi mediante el uso de eventos de dominio.
 */
export interface EventBus {
  
  /**
   * Publica un Evento de Dominio
   * 
   * Despacha un evento hacia el bus para que todos los servicios o módulos 
   * que estén escuchando (suscritos) puedan reaccionar a él de forma asíncrona.
   * 
   * @param {DomainEvent} event - Instancia del evento de dominio que contiene los datos a transmitir.
   * @returns {Promise<void>} Promesa que se resuelve cuando el evento ha sido emitido con éxito.
   */
  publish(
    event: DomainEvent,
  ): Promise<void>;

  /**
   * Suscribe un Manejador a un Evento Específico
   * 
   * Registra una función o servicio (Handler) para que actúe como oyente. Cada vez 
   * que el evento especificado sea publicado en el bus, el manejador se ejecutará automáticamente.
   * 
   * @param {DomainEventName} eventName - El nombre clave del evento de dominio que se desea escuchar.
   * @param {EventHandler} handler - La función o servicio encargado de procesar la llegada de dicho evento.
   */
  subscribe(
    eventName: DomainEventName,
    handler: EventHandler,
  ): void;
}
