import {
  DomainEventName,  
  InMemoryEventBus,
  TripRequestedEvent,
} from "@tachi/shared-events";


const eventBus = new InMemoryEventBus();


eventBus.subscribe(
  DomainEventName.TRIP_REQUESTED,
  async (event) => {
    console.log(
      "Backend recibió:",
      event.payload,
    );
  },
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