import { describe, expect, it } from "vitest";

import {
  DomainEventName,
  InMemoryEventBus,
  TripRequestedEvent,
} from "../src/index.js";

import type { DomainEvent } from "../src/events/domain-event.js";


describe(
  "InMemoryEventBus",
  () => {

    it(
      "should execute a registered handler when an event is published",
      async () => {

        const eventBus = new InMemoryEventBus();

        let receivedEvent: DomainEvent | null = null;


        const handler = async (
            event: DomainEvent,
        ) => {
            receivedEvent = event;
        };


        eventBus.subscribe(
          DomainEventName.TRIP_REQUESTED,
          handler,
        );


        const event = new TripRequestedEvent(
          "trip-001",
          {
            passengerId: "user-001",
            origin: "Mosquera",
            destination: "Funza",
          },
        );


        await eventBus.publish(event);


        expect(receivedEvent).toEqual(event);

      },
    );

    it(
        "should execute multiple handlers for the same event",
        async () => {

            const eventBus = new InMemoryEventBus();

            let matchingCalled = false;

            let notificationCalled = false;


            const matchingHandler = async (
            event: DomainEvent,
            ) => {

            matchingCalled = true;

            };


            const notificationHandler = async (
            event: DomainEvent,
            ) => {

            notificationCalled = true;

            };


            eventBus.subscribe(
            DomainEventName.TRIP_REQUESTED,
            matchingHandler,
            );


            eventBus.subscribe(
            DomainEventName.TRIP_REQUESTED,
            notificationHandler,
            );


            const event = new TripRequestedEvent(
            "trip-001",
            {
                passengerId: "user-001",
                origin: "Mosquera",
                destination: "Funza",
            },
            );


            await eventBus.publish(event);


            expect(matchingCalled).toBe(true);

            expect(notificationCalled).toBe(true);

        },
    );

    it(
        "should not fail when publishing an event without handlers",
        async () => {

            const eventBus = new InMemoryEventBus();


            const event = new TripRequestedEvent(
            "trip-001",
            {
                passengerId: "user-001",
                origin: "Mosquera",
                destination: "Funza",
            },
            );


            await expect(
            eventBus.publish(event),
            ).resolves.not.toThrow();

        },
    );

  },
);