# Domain Events & Subscribers

## When to Use Events

Use domain events for **cross-module communication** when:
- An action in Module A should trigger a reaction in Module B
- You need to maintain consistency across aggregates without tight coupling
- Side effects should be decoupled from the main operation

**Be YAGNI**: Only add events when there's a concrete current need, not hypothetical future use.

## Event Location & Naming

```
domain/events/<entity>-<action>.ts
```

| Event Type | Naming Pattern | Example |
|------------|----------------|---------|
| Created | `<Entity>Created` | `RoutineCreatedDomainEvent` |
| Deleted | `<Entity>Deleted` | `RoutineDeletedDomainEvent` |
| Field Updated | `<Entity><Field>Updated` | `RoutineNameUpdatedDomainEvent` |

**eventName format**: `<app>.<context>.<entity>.<action>`
```typescript
static eventName = "fierros.training.routine.created";
```

## Domain Event Pattern

```typescript
// domain/events/routine-created.ts
import { DomainEvent } from "../../../../../shared/domain/domain-event";
import type { RoutinePrimitives } from "../routine";

type RoutineCreatedPrimitives = Omit<RoutinePrimitives, "createdAt" | "updatedAt">;

export class RoutineCreatedDomainEvent extends DomainEvent {
  // 1. Static event name
  static eventName = "fierros.training.routine.created";

  // 2. Constructor with ALL data needed by subscribers
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly frequency: string,
    public readonly exercises: { exerciseId: string; sets: number; reps: number | null }[],
    // ... all relevant fields
  ) {
    // 3. Call super with eventName and aggregateId
    super(RoutineCreatedDomainEvent.eventName, id);
  }

  // 4. Implement toPrimitives() for serialization
  toPrimitives(): RoutineCreatedPrimitives {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      frequency: this.frequency,
      exercises: this.exercises,
    };
  }
}
```

## Update Events with Previous Value

For events that affect derived data, include the previous value:

```typescript
// domain/events/routine-frequency-updated.ts
export class RoutineFrequencyUpdatedDomainEvent extends DomainEvent {
  static eventName = "fierros.training.routine.frequency.updated";

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly frequency: string,                // new value
    public readonly previousFrequency: string,        // old value
    // ... other current state fields
  ) {
    super(RoutineFrequencyUpdatedDomainEvent.eventName, id);
  }
}
```

## Aggregate Root & Recording Events

Aggregates extend `AggregateRoot` and use `record()`:

```typescript
// Base class (shared/domain/aggregate-root.ts)
export abstract class AggregateRoot {
  private domainEvents: DomainEvent[] = [];

  pullDomainEvents(): DomainEvent[] {
    const domainEvents = this.domainEvents;
    this.domainEvents = [];
    return domainEvents;
  }

  record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}

// Aggregate method that emits event
updateFrequency(frequency: RoutineFrequencyType): void {
  const previousFrequency = this.frequency.value;
  this.frequency = new RoutineFrequency(frequency);
  this.updatedAt = new Date();

  this.record(
    new RoutineFrequencyUpdatedDomainEvent(
      this.id.value,
      this.userId.value,
      this.frequency.value,
      previousFrequency,
    ),
  );
}
```

## Subscriber Pattern

Location: `application/<action>-on-<event-trigger>.subscriber.ts`

```typescript
// application/start-workout-on-routine-activated.subscriber.ts
import { InferDependencies } from "../../../../../di/autoregister";
import type { DomainEventName } from "../../../../shared/domain/domain-event-name";
import { DomainEventSubscriber } from "../../../../shared/domain/domain-event-subscriber";
import { RoutineActivatedDomainEvent } from "../../routines/domain/events/routine-activated";
import { StartWorkout } from "./start-workout.usecase";

@InferDependencies()
export class StartWorkoutOnRoutineActivated
  extends DomainEventSubscriber<RoutineActivatedDomainEvent> {

  constructor(private readonly startWorkout: StartWorkout) {
    super();
  }

  async on(event: RoutineActivatedDomainEvent): Promise<void> {
    const { routineId, userId, exercises } = event;
    await this.startWorkout.execute({
      routineId,
      userId,
      exercises,
    });
  }

  subscribedTo(): DomainEventName<RoutineActivatedDomainEvent>[] {
    return [RoutineActivatedDomainEvent];
  }
}
```

## Granular vs Generic Events

**Prefer granular events** over generic "Updated" events:

| Aspect | Generic "Updated" | Granular Events |
|--------|-------------------|-----------------|
| Subscriber simplicity | Must diff to know what changed | Knows exactly what changed |
| Performance | All subscribers wake up | Only relevant ones react |
| Payload | Needs full before/after state | Only relevant previous value |
| Logic | One big handler with conditionals | Small, focused handlers |

Example granular events for Routine:
```
├── RoutineCreated
├── RoutineDeleted
├── RoutineNameUpdated           <- cosmetic
├── RoutineFrequencyUpdated      <- affects scheduling
├── RoutineExercisesUpdated      <- affects workout template
├── RoutineActivated             <- triggers workout creation
└── RoutineDeactivated           <- stops scheduling
```

## Quick Reference

| Component | Location | Naming |
|-----------|----------|--------|
| Event | `domain/events/` | `<Entity><Action>DomainEvent` |
| Subscriber | `application/` | `<Action>On<EventTrigger>` |
| eventName | static property | `<app>.<context>.<entity>.<action>` |

### Event Checklist
- [ ] Extends `DomainEvent`
- [ ] Has static `eventName`
- [ ] Constructor receives all data subscribers need
- [ ] Calls `super(eventName, aggregateId)`
- [ ] Implements `toPrimitives()`
- [ ] For updates: includes previous value if needed

### Subscriber Checklist
- [ ] Has `@InferDependencies()` decorator
- [ ] Extends `DomainEventSubscriber<T>`
- [ ] Implements `on()` with business logic
- [ ] Implements `subscribedTo()` returning event classes
