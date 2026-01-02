import { generateUuid } from "../../utils";

export type DomainEventAttributes = { [key: string]: unknown };

export abstract class DomainEvent {
  static fromPrimitives: (
    aggregateId: string,
    eventId: string,
    occurredOn: Date,
    attributes: DomainEventAttributes,
  ) => DomainEvent;

  public readonly eventId: string;
  public readonly occurredOn: Date;

  protected constructor(
    public readonly eventName: string,
    public readonly aggregateId: string,
    eventId?: string,
    occurredOn?: Date,
  ) {
    this.eventId = eventId ?? generateUuid();
    this.occurredOn = occurredOn ?? new Date();
  }

  abstract toPrimitives(): DomainEventAttributes;
}
