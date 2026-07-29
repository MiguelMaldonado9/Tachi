// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importación de herramientas e infraestructura desde el índice central del paquete
import { 
  DomainEventName,      // Enumerador con los nombres de todos los eventos del dominio
  InMemoryEventBus,     // Bus de eventos en memoria para comunicar módulos localmente
  TripRequestedEvent,   // Evento específico de solicitud de un viaje
} from "../index.js"; 

// Interfaz del contrato base de los eventos de dominio
import type { DomainEvent } from "../events/domain-event.js"; 

// ==========================================
// DEMOSTRACIÓN DE ARQUITECTURA PUB/SUB (1 A MUCHOS)
// ==========================================

// Instancia el bus de eventos local en memoria
const eventBus = new InMemoryEventBus(); 

// 1. Definición de Manejadores (Handlers / Oyentes)

/**
 * Manejador del Sistema de Emparejamiento (Matching)
 * Se encarga de buscar un conductor disponible cerca de la zona de origen.
 */
const matchingHandler = async (event: DomainEvent) => {
  console.log(
    "🚗 Matching recibió:",
    event.eventName, // Imprime el nombre clave del evento
    event.payload,   // Imprime los datos útiles (origen, destino, etc.)
  );
};

/**
 * Manejador del Sistema de Notificaciones
 * Se encarga de avisarle a los conductores cercanos que hay un cliente esperando.
 */
const notificationHandler = async (event: DomainEvent) => {
  console.log(
    "🔔 Notificación recibió:",
    event.eventName,
  );
};

// 2. Fase de Suscripción
// Conectamos ambos manejadores de forma independiente al mismo evento 'TRIP_REQUESTED'
eventBus.subscribe(
  DomainEventName.TRIP_REQUESTED,
  matchingHandler,
);

eventBus.subscribe(
  DomainEventName.TRIP_REQUESTED,
  notificationHandler,
);

// 3. Fase de Publicación
// Emitimos el suceso simulando que un usuario de Mosquera requiere un servicio hacia Funza
await eventBus.publish(
  new TripRequestedEvent(
    "trip-001", // ID único del viaje
    {
      passengerId: "user-001", // ID del cliente
      origin: "Mosquera",       // Punto de partida
      destination: "Funza",     // Destino final
    },
  ),
);
