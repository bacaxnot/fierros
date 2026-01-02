import type { DomainEvent } from "./domain-event";

export abstract class EventBus {
  abstract publish(events: DomainEvent[]): Promise<void>;
}
