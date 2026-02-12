# Use Case Patterns

## Overview

| Pattern | Location | Purpose |
|---------|----------|---------|
| `Find<Entity>` | `domain/` | Helper to get entity by ID, throws if not found |
| `Search<Entities>By<Criteria>` | `application/` | Query - list/search entities |
| `Create<Entity>` | `application/` | Command - create new entity |
| `Update<Entity>` | `application/` | Command - modify existing entity |
| `Delete<Entity>` | `application/` | Command - remove entity |

## Find (Domain Helper)

Lives in `domain/` layer. Used by other use cases to retrieve entities.

```typescript
// domain/find-routine.usecase.ts
import { InferDependencies } from "../../../../../di/autoregister";

import type { Routine } from "./routine";
import { RoutineDoesNotExistError } from "./routine-does-not-exist-error";
import { RoutineId } from "./routine-id";
import { RoutineRepository } from "./routine-repository";

@InferDependencies()
export class FindRoutine {
  constructor(private readonly repository: RoutineRepository) {}

  async execute(params: { id: string }): Promise<Routine> {
    const routineId = new RoutineId(params.id);
    const routine = await this.repository.search(routineId);

    if (!routine) {
      throw new RoutineDoesNotExistError(params.id);
    }

    return routine;
  }
}
```

## Search (Query)

Returns primitives (not domain objects). Lives in `application/`.

```typescript
// application/search-routines-by-user.usecase.ts
import { InferDependencies } from "../../../../../di/autoregister";

import { UserId } from "../../users/domain/user-id";
import type { RoutinePrimitives } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";

@InferDependencies()
export class SearchRoutinesByUser {
  constructor(private readonly repository: RoutineRepository) {}

  async execute(params: { userId: string }): Promise<RoutinePrimitives[]> {
    const userId = new UserId(params.userId);
    const routines = await this.repository.searchByUserId(userId);
    return routines.map((routine) => routine.toPrimitives());
  }
}
```

## Create (Command)

Creates new aggregate. Returns `void`.

```typescript
// application/create-routine.usecase.ts
import { InferDependencies } from "../../../../../di/autoregister";

import { Routine } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";
import type { RoutineExercisePrimitives } from "../domain/routine-exercise";

export type CreateRoutinePayload = {
  id: string;
  userId: string;
  name: string;
  frequency: string;
  exercises: RoutineExercisePrimitives[];
};

@InferDependencies()
export class CreateRoutine {
  constructor(private readonly repository: RoutineRepository) {}

  async execute(payload: CreateRoutinePayload): Promise<void> {
    const routine = Routine.create({
      id: payload.id,
      userId: payload.userId,
      name: payload.name,
      frequency: payload.frequency,
      exercises: payload.exercises,
    });

    await this.repository.save(routine);
  }
}
```

## Update (Command)

Uses `Find*` helper, validates ownership, applies updates via type-safe handlers.

**Key patterns:**
1. **Two-part execute signature**: `execute(params, payload)` separates auth info from update data
2. **Type-safe handlers**: `PayloadHandlers` type ensures all payload fields have handlers
3. **UnauthorizedResourceAccessError**: Shared domain error for authorization failures

```typescript
// application/update-routine.usecase.ts
import { InferDependencies } from "../../../../../di/autoregister";
import { UnauthorizedResourceAccessError } from "../../../../shared/domain/unauthorized-resource-access-error";
import { Routine } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";
import { FindRoutine } from "../domain/find-routine.usecase";
import type { RoutineExercisePrimitives } from "../domain/routine-exercise";

// Params: authorization info (userId + entity ID)
export type UpdateRoutineParams = {
  userId: string;
  routineId: string;
};

// Payload: optional update fields
export type UpdateRoutinePayload = {
  name?: string;
  frequency?: string;
  exercises?: RoutineExercisePrimitives[];
  isActive?: boolean;
};

@InferDependencies()
export class UpdateRoutine {
  constructor(
    private readonly repository: RoutineRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(
    params: UpdateRoutineParams,
    payload: UpdateRoutinePayload,
  ): Promise<void> {
    const routine = await this.findRoutine.execute({
      id: params.routineId,
    });

    this.ensureRoutineBelongsToUser(
      routine,
      params.routineId,
      params.userId,
    );

    this.applyUpdates(routine, payload);

    await this.repository.save(routine);
  }

  // Type-safe handlers pattern: ensures every payload field has a handler
  private applyUpdates(
    routine: Routine,
    payload: UpdateRoutinePayload,
  ): void {
    type PayloadHandlers = {
      [K in keyof Required<UpdateRoutinePayload>]: (
        value: Exclude<UpdateRoutinePayload[K], undefined>,
      ) => void;
    };

    const handlers = {
      name: (v) => routine.updateName(v),
      frequency: (v) => routine.updateFrequency(v),
      exercises: (v) => routine.updateExercises(v),
      isActive: (v) => routine.updateIsActive(v),
    } satisfies PayloadHandlers;

    for (const [key, handler] of Object.entries(handlers)) {
      const value = payload[key as keyof UpdateRoutinePayload];
      if (value !== undefined) {
        handler(value as never);
      }
    }
  }

  private ensureRoutineBelongsToUser(
    routine: Routine,
    routineId: string,
    userId: string,
  ): void {
    if (routine.belongsTo(userId)) return;
    throw new UnauthorizedResourceAccessError(Routine, routineId);
  }
}
```

## Delete (Command)

Uses `Find*` helper, validates ownership, deletes.

```typescript
// application/delete-routine.usecase.ts
import { InferDependencies } from "../../../../../di/autoregister";
import { UnauthorizedResourceAccessError } from "../../../../shared/domain/unauthorized-resource-access-error";
import { Routine } from "../domain/routine";
import { RoutineId } from "../domain/routine-id";
import { RoutineRepository } from "../domain/routine-repository";
import { FindRoutine } from "../domain/find-routine.usecase";

@InferDependencies()
export class DeleteRoutine {
  constructor(
    private readonly repository: RoutineRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(params: {
    userId: string;
    routineId: string;
  }): Promise<void> {
    const routine = await this.findRoutine.execute({
      id: params.routineId,
    });

    this.ensureRoutineBelongsToUser(
      routine,
      params.routineId,
      params.userId,
    );

    await this.repository.delete(new RoutineId(params.routineId));
  }

  private ensureRoutineBelongsToUser(
    routine: Routine,
    routineId: string,
    userId: string,
  ): void {
    if (routine.belongsTo(userId)) return;
    throw new UnauthorizedResourceAccessError(Routine, routineId);
  }
}
```

## Domain Error Patterns

### Shared Generic Errors

Use these when no specific domain error is needed:

| Error | When to Use | Location |
|-------|-------------|----------|
| `InvalidArgumentError` | Construction-time validation | Constructors, factories, `validateInvariants()` |
| `InvalidOperationError` | Runtime behavior methods | `approve()`, `apply()`, `cancel()`, state transitions |

**InvalidArgumentError** - Input validation:
- Value format invalid (malformed UUID, invalid email)
- Value out of range
- Invariant validation during construction (input data inconsistent)

```typescript
// In constructor or validateInvariants()
if (this.exercises.length === 0) {
  throw new InvalidArgumentError("Routine must have at least one exercise");
}
```

**InvalidOperationError** - State conflicts:
- Behavior method cannot execute given current state
- State transition not allowed on existing object

```typescript
// In behavior methods
complete(): void {
  if (!this.isActive) {
    throw new InvalidOperationError("Can only complete active workouts");
  }
  this.isActive = false;
}
```

**Note:** Granular domain errors are preferred when specific handling is needed. These are defaults when no specific error exists.

### Entity Not Found Error

```typescript
// domain/routine-does-not-exist-error.ts
import { DomainError } from "../../../../shared/domain/domain-error";

export class RoutineDoesNotExistError extends DomainError {
  readonly type = "RoutineDoesNotExistError";
  readonly message: string;

  constructor(public readonly routineId: string) {
    super();
    this.message = `The routine ${this.routineId} does not exist`;
  }
}
```

### Unauthorized Access Error (Shared)

Used when a user tries to access a resource they don't own. This is a shared error in `shared/domain/`. Takes the entity class constructor as the first argument (not a string).

```typescript
// shared/domain/unauthorized-resource-access-error.ts
import { DomainError } from "./domain-error";

type Constructor = new (...args: unknown[]) => unknown;

export class UnauthorizedResourceAccessError extends DomainError {
  readonly type = "UnauthorizedResourceAccessError";
  readonly message: string;

  constructor(
    public readonly resourceType: Constructor,
    public readonly resourceId: string,
  ) {
    super();
    this.message = `Unauthorized access to ${this.resourceType.name} ${this.resourceId}`;
  }
}
```

## Guard Placement

- **Value object invariants**: Enforced in value object constructor (e.g., non-empty, format validation)
- **Use case guards**: Only for business rules not captured by value objects (e.g., ownership checks, state transitions)

Don't duplicate value object validation in use cases. If a value object throws on invalid input, the use case doesn't need the same check.

## Aggregate Methods Required

Use cases expect these methods on aggregates:

```typescript
// Ownership check
belongsTo(userId: string): boolean

// Update methods (emit domain events internally)
updateName(name: string): void
updateFrequency(frequency: string): void

// State checks
isActive: boolean
isCompleted(): boolean

// Serialization
toPrimitives(): EntityPrimitives
```
