import {
  DomainEventName,
  InMemoryEventBus,
  TripRequestedEvent,
} from "../index.js";

import type { DomainEvent } from "../events/domain-event.js";


const eventBus = new InMemoryEventBus();


const matchingHandler = async (
  event: DomainEvent,
) => {
  console.log(
    "🚗 Matching recibió:",
    event.eventName,
    event.payload,
  );
};


const notificationHandler = async (
  event: DomainEvent,
) => {
  console.log(
    "🔔 Notificación recibió:",
    event.eventName,
  );
};


eventBus.subscribe(
  DomainEventName.TRIP_REQUESTED,
  matchingHandler,
);


eventBus.subscribe(
  DomainEventName.TRIP_REQUESTED,
  notificationHandler,
);


await eventBus.publish(
  new TripRequestedEvent(
    "trip-001",
    {
      passengerId: "user-001",
      origin: "Mosquera",
      destination: "Funza",
    },
  ),
);