import { AbstractDomainEvent } from "./abstract-domain-event.js";
import { DomainEventName } from "./domain-event-name.js";


export interface TripRequestedPayload {

  passengerId: string;

  origin: string;

  destination: string;

}


export class TripRequestedEvent
  extends AbstractDomainEvent<TripRequestedPayload>
{

  constructor(
    tripId: string,
    payload: TripRequestedPayload,
  ) {

    super(
      tripId,
      DomainEventName.TRIP_REQUESTED,
      payload,
    );

  }

}