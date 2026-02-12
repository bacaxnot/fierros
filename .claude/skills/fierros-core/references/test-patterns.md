# Core Test Patterns

Patterns for generating test code from specs.

## File Structure

```
packages/core/tests/contexts/<context>/<module>/
├── domain/
│   ├── <entity>-mother.ts              # Aggregate mother
│   ├── <vo>-mother.ts                  # VO mother (for each VO)
│   ├── mock-<entity>-repository.ts     # Repository mock
│   └── events/
│       └── <event>-mother.ts           # Event mother
└── application/
    └── <use-case>.test.ts              # Use case tests
```

## Mother Object Conventions

Mothers use static methods by convention.

### Aggregate Mother

```typescript
export class Entity1Mother {
  static create(params?: Partial<Entity1Primitives>): Entity1 {
    const primitives: Entity1Primitives = {
      id: Entity1IdMother.random().value,
      name: faker.lorem.word(),
      createdAt: TimestampMother.random().value,
      ...params,
    };
    return Entity1.fromPrimitives(primitives);
  }
}
```

**Convention:** `create(params?: Partial<Primitives>): Entity`

### VO Mother

ALL VOs (including IDs) have both `random()` and `invalidValue()`:

```typescript
// ID VO - extends IdMother (inherits random() and invalidValue())
export class Entity1IdMother extends IdMother {}

// VO with specific invariant (e.g., "cannot be empty")
export class AuthIdMother {
  static random(): AuthId {
    return new AuthId(faker.string.uuid());
  }

  static invalidValue(): string {
    return ""; // violates "cannot be empty"
  }
}

// VO with format invariant (e.g., email)
export class EmailMother {
  static random(): Email {
    return new Email(faker.internet.email());
  }

  static invalidValue(): string {
    return faker.lorem.word(); // not a valid email format
  }
}
```

**Convention:**
- `random(): VO` - valid random instance
- `invalidValue(): string` - random invalid primitive
- ID VOs extend `IdMother` (no custom implementation needed)

### Event Mother

```typescript
export class Entity1CreatedDomainEventMother {
  static create(params?: Partial<Entity1Primitives>): Entity1CreatedDomainEvent {
    const primitives: Entity1Primitives = {
      id: Entity1IdMother.random().value,
      name: faker.lorem.word(),
      createdAt: TimestampMother.random().value,
      ...params,
    };
    return new Entity1CreatedDomainEvent(
      primitives.id,
      primitives.name,
      primitives.createdAt,
    );
  }
}
```

**Convention:** `create(params?: Partial<Primitives>): Event`

## Deriving Mothers from Spec

| Spec Element | Mother Methods |
|--------------|----------------|
| Aggregate | `create(params?)` |
| VO (all) | `random()`, `invalidValue()` |
| Event | `create(params?)` |

## Mock Repositories

Mocks expose `mock(() => {})` from `bun:test` directly for flexible assertions:

```typescript
import { mock } from "bun:test";

export class MockRoutineRepository implements RoutineRepository {
  readonly save = mock(() => {});
  readonly search = mock(() => {});

  returnOnSearch(entity: Routine | null): void {
    this.search.mockResolvedValue(entity);
  }
}
```

In tests, use standard assertions:
```typescript
expect(repository.save).toHaveBeenCalledWith(expected);
expect(repository.search).toHaveBeenCalledWith(expectedId);
```

## Deriving Mocks from Collaborators

| Collaborator | Test Double | Pattern |
|--------------|-------------|---------|
| Repository | `Mock<Name>` | Implements interface, exposes `mock(() => {})`, has `returnOn*` helpers |
| EventBus | `MockEventBus` | Shared, in `tests/shared/domain/` |
| Clock | `StubClock` | Shared, returns fixed timestamp |
| Other Gateway | `Mock<Name>` or `Stub<Name>` | Mock if verifying calls, Stub if just returning values |

## Test Structure from Spec

Given this spec:
```
CreateWorkout ({...}) -> Workout
  [WorkoutRepository, EventBus]

  happy:
    base: creates workout, persists, publishes WorkoutCreatedEvent
    scenarios:
      - with full routine exercises
      - with partial routine exercises

  guards:
    - rejects if routine does not exist -> RoutineNotFoundError

  validation:
    - routineId must be valid
    - userId must be valid
```

Generate this test:
```typescript
import { describe, it, expect, beforeEach, mock } from "bun:test";

describe("CreateWorkout", () => {
  const timestamp = TimestampMother.fixed("2025-01-01T00:00:00.000Z");

  let repository: MockWorkoutRepository;
  let eventBus: MockEventBus;
  let clock: StubClock;
  let usecase: CreateWorkout;

  beforeEach(() => {
    repository = new MockWorkoutRepository();
    eventBus = new MockEventBus();
    clock = new StubClock(timestamp);
    usecase = new CreateWorkout(repository, eventBus, clock);
  });

  // Happy path tests
  it("creates workout with full routine exercises", async () => {
    const expected = WorkoutMother.create({
      exercises: RoutineExerciseMother.fullSet(),
      createdAt: timestamp.value,
    });
    const expectedEvent = WorkoutCreatedDomainEventMother.create({...});

    await usecase.execute(expected.toPrimitives());

    expect(repository.save).toHaveBeenCalledWith(expected);
    eventBus.assertLastPublishedEventIs(expectedEvent);
  });

  it("creates workout with partial routine exercises", async () => {
    const expected = WorkoutMother.create({
      exercises: RoutineExerciseMother.partialSet(),
      createdAt: timestamp.value,
    });
    // ... same base assertions ...
  });

  // Guard tests
  it("rejects if routine does not exist", async () => {
    repository.returnOnSearch(null);

    await expect(
      usecase.execute({...})
    ).rejects.toThrow(RoutineNotFoundError);
  });

  // Validation test
  it("validates input", async () => {
    const validPrimitives = WorkoutMother.create().toPrimitives();

    // routineId must be valid
    await expectInvalidArgumentError(
      usecase.execute({ ...validPrimitives, routineId: RoutineIdMother.invalidValue() })
    );

    // userId must be valid
    await expectInvalidArgumentError(
      usecase.execute({ ...validPrimitives, userId: UserIdMother.invalidValue() })
    );
  });
});
```

## Subscriber Entry Point

When spec has `test-entry: SubscriberName`, the test instantiates the subscriber in beforeEach:

```typescript
import { describe, it, expect, beforeEach, mock } from "bun:test";

describe("SubscriberName should", () => {
  const timestamp = TimestampMother.fixed("2025-01-01T00:00:00.000Z");

  let repository: MockEntityRepository;
  let eventBus: MockEventBus;
  let clock: StubClock;
  let subscriber: SubscriberName;

  beforeEach(() => {
    repository = new MockEntityRepository();
    eventBus = new MockEventBus();
    clock = new StubClock(timestamp);
    subscriber = new SubscriberName(
      new UseCaseName(repository, eventBus, clock)
    );
  });

  it("does action when event received", async () => {
    const event = TriggerEventMother.create();

    await subscriber.on(event);

    // ... assertions ...
  });
});
```

## Shared Test Utilities

Located in `packages/core/tests/shared/domain/`:

- `TimestampMother` - `random()`, `fixed(value)`
- `MockEventBus` - `publish()`, `assertLastPublishedEventIs()`
- `StubClock` - constructor takes `Timestamp`, `now()` returns it
- `IdMother` - base class for ID mothers with `random()` and `invalidValue()`
- `expectInvalidArgumentError` - helper for validation tests
