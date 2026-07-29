// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importación del contrato base que define la anatomía de un evento de dominio
import type { DomainEvent } from "../events/domain-event.js"; 

// ==========================================
// DEFINICIÓN DE TIPOS ESTRUCTURALES (TYPES)
// ==========================================

/**
 * Tipo Manejador de Eventos (EventHandler)
 * 
 * Define la firma estricta que debe cumplir cualquier función o servicio que desee 
 * actuar como oyente (Listener/Subscriber) de eventos dentro del monorrepo.
 * 
 * Garantiza que la función reciba un 'DomainEvent' válido y devuelva una promesa vacía,
 * forzando a que todo el procesamiento de eventos secundarios sea asíncrono.
 * 
 * @param {DomainEvent} event - El evento de dominio que acaba de ser publicado en el bus.
 * @returns {Promise<void>} Una promesa que resuelve cuando el manejador termina de procesar el evento.
 */
export type EventHandler = (
  event: DomainEvent,
) => Promise<void>;
