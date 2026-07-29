// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Herramientas oficiales del framework de pruebas 'Vitest'
import { describe, expect, it } from "vitest"; 

// Componentes internos del paquete compartidos listos para ser evaluados
import { 
  DomainEventName, 
  InMemoryEventBus, 
  TripRequestedEvent 
} from "../src/index.js"; 

// Interfaz que define la estructura obligatoria de un evento de dominio
import type { DomainEvent } from "../src/events/domain-event.js"; 

// ==========================================
// SUITE DE PRUEBAS UNITARIAS (EVENT BUS TEST)
// ==========================================

/**
 * Suite de Pruebas para el Bus de Eventos en Memoria
 * 
 * Evalúa rigurosamente el comportamiento del patrón Pub/Sub, garantizando
 * la correcta entrega de mensajes, la ejecución de múltiples oyentes
 * y la resiliencia del sistema ante la ausencia de suscriptores.
 */
describe("InMemoryEventBus", () => {
  
  /**
   * Caso de Uso 1: Registro y ejecución exitosa de un manejador único
   */
  it("should execute a registered handler when an event is published", async () => {
    // 1. Inicialización del entorno de pruebas
    const eventBus = new InMemoryEventBus();
    let receivedEvent: DomainEvent | null = null;

    // 2. Creación de un manejador de prueba (Mock) que captura el evento entrante
    const handler = async (event: DomainEvent) => {
      receivedEvent = event;
    };

    // 3. Suscripción al evento de solicitud de viaje
    eventBus.subscribe(
      DomainEventName.TRIP_REQUESTED,
      handler,
    );

    // 4. Instanciación del evento con datos simulados (Mosquera a Funza)
    const event = new TripRequestedEvent(
      "trip-001",
      {
        passengerId: "user-001",
        origin: "Mosquera",
        destination: "Funza",
      },
    );

    // 5. Ejecución del método bajo prueba
    await eventBus.publish(event);

    // 6. Aserción: Comprueba que el manejador recibió exactamente el mismo evento que se publicó
    expect(receivedEvent).toEqual(event);
  });

  /**
   * Caso de Uso 2: Distribución de un mismo evento hacia múltiples oyentes (Fan-out)
   */
  it("should execute multiple handlers for the same event", async () => {
    // 1. Inicialización del entorno de pruebas
    const eventBus = new InMemoryEventBus();
    let matchingCalled = false;
    let notificationCalled = false;

    // 2. Creación de manejadores independientes para simular sistemas aislados
    const matchingHandler = async (event: DomainEvent) => {
      matchingCalled = true;
    };

    const notificationHandler = async (event: DomainEvent) => {
      notificationCalled = true;
    };

    // 3. Conexión de ambos oyentes al mismo canal de eventos
    eventBus.subscribe(
      DomainEventName.TRIP_REQUESTED,
      matchingHandler,
    );

    eventBus.subscribe(
      DomainEventName.TRIP_REQUESTED,
      notificationHandler,
    );

    // 4. Instanciación del evento
    const event = new TripRequestedEvent(
      "trip-001",
      {
        passengerId: "user-001",
        origin: "Mosquera",
        destination: "Funza",
      },
    );

    // 5. Publicación en el bus
    await eventBus.publish(event);

    // 6. Aserción: Valida que ambos sistemas reaccionaron de forma exitosa e independiente
    expect(matchingCalled).toBe(true);
    expect(notificationCalled).toBe(true);
  });

  /**
   * Caso de Uso 3: Resiliencia cuando un evento no tiene interesados
   */
  it("should not fail when publishing an event without handlers", async () => {
    // 1. Inicialización del entorno de pruebas (Bus completamente vacío)
    const eventBus = new InMemoryEventBus();

    // 2. Creación del evento
    const event = new TripRequestedEvent(
      "trip-001",
      {
        passengerId: "user-001",
        origin: "Mosquera",
        destination: "Funza",
      },
    );

    // 3. Aserción Directa: Asegura que la promesa se resuelva correctamente 
    // y que el bus no arroje ninguna excepción (Crash) al no encontrar oyentes
    await expect(
      eventBus.publish(event),
    ).resolves.not.toThrow();
  });
});
