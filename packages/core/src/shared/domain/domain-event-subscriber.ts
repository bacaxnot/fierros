import type { DomainEvent } from "./domain-event";
import type { DomainEventName } from "./domain-event-name";

export abstract class DomainEventSubscriber<T extends DomainEvent> {
  abstract on(domainEvent: T): Promise<void>;

  abstract subscribedTo(): DomainEventName<T>[];
}
