import type { DomainEventName } from "./domain-event-name.js";
import { randomUUID } from "node:crypto";

import type { DomainEvent } from "./domain-event.js";

export abstract class AbstractDomainEvent<TPayload = unknown>
  implements DomainEvent<TPayload>
{
  public readonly eventId: string;

  public readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly eventName: DomainEventName,
    public readonly payload: TPayload,
  ) {
    this.eventId = randomUUID();
    this.occurredAt = new Date();
  }
}