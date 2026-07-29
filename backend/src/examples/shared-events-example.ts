// ==========================================
// IMPORTS Y DEPENDENCIAS
// ==========================================

// Importación de elementos desde el paquete compartido de eventos de tu monorrepo
import { 
  DomainEventName,      // Enumerador con los nombres de todos los eventos del dominio
  InMemoryEventBus,     // Bus de eventos en memoria para comunicar módulos localmente
  TripRequestedEvent,   // Evento específico que representa la solicitud de un viaje
} from "@tachi/shared-events"; 

// ==========================================
// DEMOSTRACIÓN DE ARQUITECTURA ORIENTADA A EVENTOS
// ==========================================

// Instancia el bus de eventos que funcionará de forma local en la memoria de la aplicación
const eventBus = new InMemoryEventBus(); 

// 1. Fase de Suscripción (Listener / Consumidor)
// Le indicamos al bus que escuche atentamente cada vez que ocurra un evento de tipo 'TRIP_REQUESTED'
eventBus.subscribe(
  DomainEventName.TRIP_REQUESTED, 
  async (event) => {
    // Acción que se ejecuta de forma asíncrona cuando llega el evento
    console.log(
      "Backend recibió:", 
      event.payload, // Contiene los datos útiles y estructurados del viaje solicitado
    );
  },
);

// 2. Fase de Publicación (Publisher / Emisor)
// Despachamos un nuevo evento simulando que un cliente acaba de pedir un viaje
await eventBus.publish(
  new TripRequestedEvent(
    "trip-001", // ID único generado para identificar esta transacción de viaje
    {
      passengerId: "user-001", // Identificador del usuario pasajero
      origin: "Mosquera",       // Punto de partida del viaje
      destination: "Funza",     // Punto de destino del viaje
    },
  ),
);
