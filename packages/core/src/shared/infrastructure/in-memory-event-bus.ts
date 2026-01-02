import type { DomainEvent } from "../domain/domain-event";
import type { DomainEventSubscriber } from "../domain/domain-event-subscriber";
import type { EventBus } from "../domain/event-bus";

type Subscriber = (event: DomainEvent) => Promise<void>;

export class InMemoryEventBus implements EventBus {
  private readonly subscriptions: Map<string, Subscriber[]> = new Map();

  constructor(subscribers: DomainEventSubscriber<DomainEvent>[]) {
    this.registerSubscribers(subscribers);
  }

  async publish(events: DomainEvent[]): Promise<void> {
    const executions: unknown[] = [];

    events.forEach((event) => {
      const subscribers = this.subscriptions.get(event.eventName);

      if (subscribers) {
        subscribers.forEach((subscriber) => {
          executions.push(subscriber(event));
        });
      }
    });

    await Promise.all(executions).catch((error) => {
      console.error("Executing subscriptions:", error);
    });
  }

  private registerSubscribers(
    subscribers: DomainEventSubscriber<DomainEvent>[],
  ): void {
    subscribers.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        this.subscribe(event.eventName, subscriber);
      });
    });
  }

  private subscribe(
    eventName: string,
    subscriber: DomainEventSubscriber<DomainEvent>,
  ): void {
    const currentSubscriptions = this.subscriptions.get(eventName);
    const subscription = subscriber.on.bind(subscriber);

    if (currentSubscriptions) {
      currentSubscriptions.push(subscription);
    } else {
      this.subscriptions.set(eventName, [subscription]);
    }
  }
}
