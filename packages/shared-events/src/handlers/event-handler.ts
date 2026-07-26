import type { DomainEvent } from "../events/domain-event.js";

export type EventHandler = (
  event: DomainEvent,
) => Promise<void>;