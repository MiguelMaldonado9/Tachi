// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Interfaz contrato del bus de eventos
import type { EventBus } from "../bus/event-bus.js"; 

// Catálogo maestro con los nombres oficiales de los eventos
import { DomainEventName } from "../events/domain-event-name.js"; 

// Interfaz que define la estructura obligatoria de un evento de dominio
import type { DomainEvent } from "../events/domain-event.js"; 

// Firma de tipo requerida para las funciones oyentes (listeners)
import type { EventHandler } from "../handlers/event-handler.js"; 

// ==========================================
// IMPLEMENTACIÓN CONCRETA (IN MEMORY EVENT BUS)
// ==========================================

/**
 * Bus de Eventos en Memoria (InMemoryEventBus)
 * 
 * Implementación física de la interfaz EventBus que administra la mensajería 
 * de forma local dentro de la misma memoria RAM del proceso de Node.js.
 * 
 * Ideal para comunicar módulos internos de forma desacoplada en entornos de 
 * desarrollo o monorrepos compactos sin añadir infraestructura externa.
 */
export class InMemoryEventBus implements EventBus {
  
  // Diccionario en memoria (Map) que asocia cada nombre de evento con un arreglo de funciones oyentes
  private readonly handlers = new Map<DomainEventName, EventHandler[]>();

  /**
   * Publica un Evento a todos sus Suscriptores
   * 
   * Recupera el listado de funciones registradas para el tipo de evento recibido
   * y las ejecuta una a una de manera asíncrona y secuencial.
   * 
   * @param {DomainEvent} event - Instancia del evento de dominio emitido.
   * @returns {Promise<void>}
   */
  async publish(
    event: DomainEvent,
  ): Promise<void> {
    // 1. Obtiene los manejadores suscritos a este evento, o un arreglo vacío si nadie escucha
    const handlers = this.handlers.get(event.eventName) ?? [];

    // 2. Itera y ejecuta cada manejador de forma segura dentro de un ciclo asíncrono
    for (const handler of handlers) {
      try {
        // Ejecuta la lógica del suscriptor esperando a que termine su promesa
        await handler(event);
      } catch (error) {
        // 3. Mecanismo de Aislamiento de Fallos:
        // Si un suscriptor falla (ej. error al enviar un SMS), captura el error en consola
        // pero NO interrumpe la ejecución; los demás suscriptores de la lista seguirán procesándose
        console.error(
          `Error executing handler for ${event.eventName}`,
          error,
        );
      }
    }
  }

  /**
   * Registra un nuevo Suscriptor para un Evento Específico
   * 
   * @param {DomainEventName} eventName - Nombre clave del evento al que desea suscribirse.
   * @param {EventHandler} handler - Función que se disparará cuando ocurra el suceso.
   */
  subscribe(
    eventName: DomainEventName,
    handler: EventHandler,
  ): void {
    // 1. Recupera la lista actual de oyentes para ese evento o inicia una nueva vacía
    const handlers = this.handlers.get(eventName) ?? [];

    // 2. Añade el nuevo manejador al final de la lista
    handlers.push(handler);

    // 3. Guarda la lista actualizada de vuelta en el mapa en memoria
    this.handlers.set(eventName, handlers);
  }
}
