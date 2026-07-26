import type { DomainEvent } from "../events/domain-event.js";
import { DomainEventName } from "../events/domain-event-name.js";
import type { EventHandler } from "../handlers/event-handler.js";

export interface EventBus {

  publish(
    event: DomainEvent,
  ): Promise<void>;

  subscribe(
    eventName: DomainEventName,
    handler: EventHandler,
  ): void;

}