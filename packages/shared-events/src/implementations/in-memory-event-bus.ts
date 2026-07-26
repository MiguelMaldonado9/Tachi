import type { EventBus } from "../bus/event-bus.js";
import { DomainEventName } from "../events/domain-event-name.js";
import type { DomainEvent } from "../events/domain-event.js";
import type { EventHandler } from "../handlers/event-handler.js";

export class InMemoryEventBus implements EventBus {

  private readonly handlers = new Map<
    DomainEventName,
    EventHandler[]
  >();

  async publish(
    event: DomainEvent,
  ): Promise<void> {

    const handlers =
      this.handlers.get(event.eventName) ?? [];


    for (const handler of handlers) {

      try {

        await handler(event);

      } catch (error) {

        console.error(
          `Error executing handler for ${event.eventName}`,
          error,
        );

      }

    }
  }

  subscribe(
    eventName: DomainEventName,
    handler: EventHandler,
  ): void {
    const handlers = 
      this.handlers.get(eventName) ?? [];

    handlers.push(handler);

    this.handlers.set(eventName, handlers);

  }
}