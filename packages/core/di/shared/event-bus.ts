import type { ContainerBuilder } from "diod";
import type { DomainEvent } from "../../src/shared/domain/domain-event";
import type { DomainEventSubscriber } from "../../src/shared/domain/domain-event-subscriber";
import { EventBus } from "../../src/shared/domain/event-bus";
import { InMemoryEventBus } from "../../src/shared/infrastructure/in-memory-event-bus";
import { DOMAIN_EVENT_SUBSCRIBER } from "../tags";

export function register(builder: ContainerBuilder) {
  builder.register(EventBus).useFactory((container) => {
    /*
     * We automatically get all the subscribers from the container.
     * In order for this to work, they need to use the @DomainEventSubscriber decorator.
     *
     * Example:
     * @DomainEventSubscriber()
     * class UpdateAccountBalanceOnTransactionCreated implements DomainEventSubscriber<TransactionCreatedDomainEvent> {
     *   // ... implementation
     * }
     *
     */
    const subscribers = container
      .findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>(
        DOMAIN_EVENT_SUBSCRIBER,
      )
      .map((identifier) => container.get(identifier));
    return new InMemoryEventBus(subscribers);
  });
}
