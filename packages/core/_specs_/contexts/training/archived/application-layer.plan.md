# Fierros Application Layer Design

Based on the patterns from the finance app (accounts/transactions modules) and the domain model already implemented.

## Requirements

1. **Routines**: list, create, update, delete
2. **Workouts**: list, start from routine, discard (delete ongoing), finish
3. **Exercises**: list only
4. **Exercise Metrics**: list only

## Folder Structure

```
packages/core/src/contexts/training/
├── routines/
│   ├── domain/
│   │   ├── ... (existing)
│   │   ├── find-routine.usecase.ts           # Helper use case (like FindAccount)
│   │   └── routine-does-not-exist-error.ts   # Domain error
│   └── application/
│       ├── search-routines-by-user.usecase.ts
│       ├── create-routine.usecase.ts
│       ├── update-routine.usecase.ts
│       └── delete-routine.usecase.ts
├── workouts/
│   ├── domain/
│   │   ├── ... (existing)
│   │   ├── find-workout.usecase.ts           # Helper use case
│   │   ├── workout-does-not-exist-error.ts   # Domain error
│   │   └── workout-already-finished-error.ts # Domain error
│   └── application/
│       ├── search-workouts-by-user.usecase.ts
│       ├── start-workout-from-routine.usecase.ts
│       ├── discard-workout.usecase.ts
│       └── finish-workout.usecase.ts
├── exercises/
│   ├── domain/
│   │   └── ... (existing)
│   └── application/
│       └── search-exercises-by-user.usecase.ts
└── exercise-metrics/
    ├── domain/
    │   └── ... (existing)
    └── application/
        └── search-all-exercise-metrics.usecase.ts
```

## Implementation Details

### Routines Module

#### `routines/domain/routine-does-not-exist-error.ts`
```typescript
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

#### `routines/domain/find-routine.usecase.ts`
```typescript
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

#### `routines/application/search-routines-by-user.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { UserId } from "../../users/domain/user-id";
import type { RoutinePrimitives } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";

@InferDependencies()
export class SearchRoutinesByUser {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(params: { userId: string }): Promise<RoutinePrimitives[]> {
    const userId = new UserId(params.userId);
    const routines = await this.routineRepository.searchByUserId(userId);
    return routines.map((routine) => routine.toPrimitives());
  }
}
```

#### `routines/application/create-routine.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { Routine, type RoutineBlockPrimitives } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";

export type CreateRoutinePayload = {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  blocks?: RoutineBlockPrimitives[];
};

@InferDependencies()
export class CreateRoutine {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async execute(payload: CreateRoutinePayload): Promise<void> {
    const routine = Routine.create({
      id: payload.id,
      userId: payload.userId,
      name: payload.name,
      description: payload.description,
      blocks: payload.blocks,
    });

    await this.routineRepository.save(routine);
  }
}
```

#### `routines/application/update-routine.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import type { RoutineBlockPrimitives } from "../domain/routine";
import { FindRoutine } from "../domain/find-routine.usecase";
import { RoutineRepository } from "../domain/routine-repository";

export type UpdateRoutinePayload = {
  userId: string;
  routineId: string;
  name?: string;
  description?: string | null;
  blocks?: RoutineBlockPrimitives[];
};

@InferDependencies()
export class UpdateRoutine {
  constructor(
    private readonly repository: RoutineRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(payload: UpdateRoutinePayload): Promise<void> {
    const routine = await this.findRoutine.execute({ id: payload.routineId });

    this.ensureRoutineBelongsToUser(routine, payload.userId);

    // Update fields (requires adding update methods to Routine aggregate)
    if (payload.name !== undefined) {
      routine.updateName(payload.name);
    }
    if (payload.description !== undefined) {
      routine.updateDescription(payload.description);
    }
    if (payload.blocks !== undefined) {
      routine.updateBlocks(payload.blocks);
    }

    await this.repository.save(routine);
  }

  private ensureRoutineBelongsToUser(routine: Routine, userId: string): void {
    if (routine.belongsTo(userId)) return;
    throw new Error("Routine does not belong to user");
  }
}
```

**Note**: This requires adding methods to `Routine` aggregate:
- `updateName(name: string): void`
- `updateDescription(description: string | null): void`
- `updateBlocks(blocks: RoutineBlockPrimitives[]): void`
- `belongsTo(userId: string): boolean`

#### `routines/application/delete-routine.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { FindRoutine } from "../domain/find-routine.usecase";
import { RoutineId } from "../domain/routine-id";
import { RoutineRepository } from "../domain/routine-repository";

@InferDependencies()
export class DeleteRoutine {
  constructor(
    private readonly repository: RoutineRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(params: { userId: string; routineId: string }): Promise<void> {
    const routine = await this.findRoutine.execute({ id: params.routineId });

    this.ensureRoutineBelongsToUser(routine, params.userId);

    await this.repository.delete(new RoutineId(params.routineId));
  }

  private ensureRoutineBelongsToUser(routine: Routine, userId: string): void {
    if (routine.belongsTo(userId)) return;
    throw new Error("Routine does not belong to user");
  }
}
```

---

### Workouts Module

#### `workouts/domain/workout-does-not-exist-error.ts`
```typescript
import { DomainError } from "../../../../shared/domain/domain-error";

export class WorkoutDoesNotExistError extends DomainError {
  readonly type = "WorkoutDoesNotExistError";
  readonly message: string;

  constructor(public readonly workoutId: string) {
    super();
    this.message = `The workout ${this.workoutId} does not exist`;
  }
}
```

#### `workouts/domain/workout-already-finished-error.ts`
```typescript
import { DomainError } from "../../../../shared/domain/domain-error";

export class WorkoutAlreadyFinishedError extends DomainError {
  readonly type = "WorkoutAlreadyFinishedError";
  readonly message: string;

  constructor(public readonly workoutId: string) {
    super();
    this.message = `The workout ${this.workoutId} is already finished`;
  }
}
```

#### `workouts/domain/find-workout.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import type { Workout } from "./workout";
import { WorkoutDoesNotExistError } from "./workout-does-not-exist-error";
import { WorkoutId } from "./workout-id";
import { WorkoutRepository } from "./workout-repository";

@InferDependencies()
export class FindWorkout {
  constructor(private readonly repository: WorkoutRepository) {}

  async execute(params: { id: string }): Promise<Workout> {
    const workoutId = new WorkoutId(params.id);
    const workout = await this.repository.search(workoutId);

    if (!workout) {
      throw new WorkoutDoesNotExistError(params.id);
    }

    return workout;
  }
}
```

#### `workouts/application/search-workouts-by-user.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { UserId } from "../../users/domain/user-id";
import type { WorkoutPrimitives } from "../domain/workout";
import { WorkoutRepository } from "../domain/workout-repository";

@InferDependencies()
export class SearchWorkoutsByUser {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute(params: { userId: string }): Promise<WorkoutPrimitives[]> {
    const userId = new UserId(params.userId);
    const workouts = await this.workoutRepository.searchByUserId(userId);
    return workouts.map((workout) => workout.toPrimitives());
  }
}
```

#### `workouts/application/start-workout-from-routine.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { FindRoutine } from "../../routines/domain/find-routine.usecase";
import { Workout } from "../domain/workout";
import { WorkoutRepository } from "../domain/workout-repository";

export type StartWorkoutFromRoutinePayload = {
  workoutId: string;
  userId: string;
  routineId: string;
};

@InferDependencies()
export class StartWorkoutFromRoutine {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(payload: StartWorkoutFromRoutinePayload): Promise<void> {
    const routine = await this.findRoutine.execute({ id: payload.routineId });
    const routinePrimitives = routine.toPrimitives();

    this.ensureRoutineBelongsToUser(routine, payload.userId);

    // Convert routine blocks to workout blocks (copy structure)
    const workoutBlocks = routinePrimitives.blocks.map((block) => ({
      order: block.order,
      notes: block.notes,
      startedAt: null,
      finishedAt: null,
      sets: block.sets.map((set) => ({
        order: set.order,
        exerciseId: set.exerciseId,
        notes: set.notes,
        startedAt: null,
        finishedAt: null,
        restTime: set.restTime ?? block.defaultRestTime,
        metrics: set.metrics.map((metric) => ({
          metricId: metric.metricId,
          value: null, // No recorded value yet
          targetRange: metric.targetRange,
          targetValue: metric.targetValue,
        })),
      })),
    }));

    const workout = Workout.create({
      id: payload.workoutId,
      userId: payload.userId,
      routineId: payload.routineId,
      name: routinePrimitives.name,
      blocks: workoutBlocks,
    });

    await this.workoutRepository.save(workout);
  }

  private ensureRoutineBelongsToUser(routine: Routine, userId: string): void {
    if (routine.belongsTo(userId)) return;
    throw new Error("Routine does not belong to user");
  }
}
```

#### `workouts/application/discard-workout.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { FindWorkout } from "../domain/find-workout.usecase";
import { WorkoutAlreadyFinishedError } from "../domain/workout-already-finished-error";
import { WorkoutId } from "../domain/workout-id";
import { WorkoutRepository } from "../domain/workout-repository";

@InferDependencies()
export class DiscardWorkout {
  constructor(
    private readonly repository: WorkoutRepository,
    private readonly findWorkout: FindWorkout,
  ) {}

  async execute(params: { userId: string; workoutId: string }): Promise<void> {
    const workout = await this.findWorkout.execute({ id: params.workoutId });

    this.ensureWorkoutBelongsToUser(workout, params.userId);
    this.ensureWorkoutIsNotFinished(workout, params.workoutId);

    await this.repository.delete(new WorkoutId(params.workoutId));
  }

  private ensureWorkoutBelongsToUser(workout: Workout, userId: string): void {
    if (workout.belongsTo(userId)) return;
    throw new Error("Workout does not belong to user");
  }

  private ensureWorkoutIsNotFinished(workout: Workout, workoutId: string): void {
    if (!workout.isFinished()) return;
    throw new WorkoutAlreadyFinishedError(workoutId);
  }
}
```

**Note**: This requires adding methods to `Workout` aggregate:
- `belongsTo(userId: string): boolean`
- `isFinished(): boolean`

#### `workouts/application/finish-workout.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { FindWorkout } from "../domain/find-workout.usecase";
import { WorkoutAlreadyFinishedError } from "../domain/workout-already-finished-error";
import { WorkoutRepository } from "../domain/workout-repository";

@InferDependencies()
export class FinishWorkout {
  constructor(
    private readonly repository: WorkoutRepository,
    private readonly findWorkout: FindWorkout,
  ) {}

  async execute(params: { userId: string; workoutId: string }): Promise<void> {
    const workout = await this.findWorkout.execute({ id: params.workoutId });

    this.ensureWorkoutBelongsToUser(workout, params.userId);
    this.ensureWorkoutIsNotFinished(workout, params.workoutId);

    workout.finish();

    await this.repository.save(workout);
  }

  private ensureWorkoutBelongsToUser(workout: Workout, userId: string): void {
    if (workout.belongsTo(userId)) return;
    throw new Error("Workout does not belong to user");
  }

  private ensureWorkoutIsNotFinished(workout: Workout, workoutId: string): void {
    if (!workout.isFinished()) return;
    throw new WorkoutAlreadyFinishedError(workoutId);
  }
}
```

**Note**: This requires adding method to `Workout` aggregate:
- `finish(): void` (sets finishedAt and updatedAt)

---

### Exercises Module

#### `exercises/application/search-exercises-by-user.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import { UserId } from "../../users/domain/user-id";
import type { ExercisePrimitives } from "../domain/exercise";
import { ExerciseRepository } from "../domain/exercise-repository";

@InferDependencies()
export class SearchExercisesByUser {
  constructor(private readonly exerciseRepository: ExerciseRepository) {}

  async execute(params: { userId: string }): Promise<ExercisePrimitives[]> {
    const userId = new UserId(params.userId);
    const exercises = await this.exerciseRepository.searchByUserId(userId);
    return exercises.map((exercise) => exercise.toPrimitives());
  }
}
```

**Note**: The repository `searchByUserId` should return both system exercises (userId = null) and user-specific exercises.

---

### Exercise Metrics Module

#### `exercise-metrics/application/search-all-exercise-metrics.usecase.ts`
```typescript
import { InferDependencies } from "../../../../../di/autoregister";

import type { ExerciseMetricPrimitives } from "../domain/exercise-metric";
import { ExerciseMetricRepository } from "../domain/exercise-metric-repository";

@InferDependencies()
export class SearchAllExerciseMetrics {
  constructor(private readonly exerciseMetricRepository: ExerciseMetricRepository) {}

  async execute(): Promise<ExerciseMetricPrimitives[]> {
    const metrics = await this.exerciseMetricRepository.searchAll();
    return metrics.map((metric) => metric.toPrimitives());
  }
}
```

---

## Domain Model Updates Required

Before implementing the application layer, these methods need to be added to the aggregates:

### Routine Aggregate
```typescript
// In routine.ts
belongsTo(userId: string): boolean {
  return this.userId.value === userId;
}

updateName(name: string): void {
  this.name = new RoutineName(name);
  this.updatedAt = new Date();
}

updateDescription(description: string | null): void {
  this.description = description ? new RoutineDescription(description) : null;
  this.updatedAt = new Date();
}

updateBlocks(blocks: RoutineBlockPrimitives[]): void {
  this.blocks = blocks.map(RoutineBlock.fromPrimitives);
  this.updatedAt = new Date();
}
```

### Workout Aggregate
```typescript
// In workout.ts
belongsTo(userId: string): boolean {
  return this.userId.value === userId;
}

isFinished(): boolean {
  return this.finishedAt !== null;
}

finish(): void {
  this.finishedAt = new Date();
  this.updatedAt = new Date();
}
```

---

## Files to Create (12 files)

| Module | Path | Type |
|--------|------|------|
| Routines | `routines/domain/routine-does-not-exist-error.ts` | Domain Error |
| Routines | `routines/domain/find-routine.usecase.ts` | Helper Use Case |
| Routines | `routines/application/search-routines-by-user.usecase.ts` | Query |
| Routines | `routines/application/create-routine.usecase.ts` | Command |
| Routines | `routines/application/update-routine.usecase.ts` | Command |
| Routines | `routines/application/delete-routine.usecase.ts` | Command |
| Workouts | `workouts/domain/workout-does-not-exist-error.ts` | Domain Error |
| Workouts | `workouts/domain/workout-already-finished-error.ts` | Domain Error |
| Workouts | `workouts/domain/find-workout.usecase.ts` | Helper Use Case |
| Workouts | `workouts/application/search-workouts-by-user.usecase.ts` | Query |
| Workouts | `workouts/application/start-workout-from-routine.usecase.ts` | Command |
| Workouts | `workouts/application/discard-workout.usecase.ts` | Command |
| Workouts | `workouts/application/finish-workout.usecase.ts` | Command |
| Exercises | `exercises/application/search-exercises-by-user.usecase.ts` | Query |
| ExerciseMetrics | `exercise-metrics/application/search-all-exercise-metrics.usecase.ts` | Query |

## Implementation Order

1. **Phase 1: Domain Errors**
   - `routine-does-not-exist-error.ts`
   - `workout-does-not-exist-error.ts`
   - `workout-already-finished-error.ts`

2. **Phase 2: Domain Model Updates**
   - Add `belongsTo`, `updateName`, `updateDescription`, `updateBlocks` to `Routine`
   - Add `belongsTo`, `isFinished`, `finish` to `Workout`

3. **Phase 3: Helper Use Cases (domain layer)**
   - `find-routine.usecase.ts`
   - `find-workout.usecase.ts`

4. **Phase 4: Query Use Cases**
   - `search-routines-by-user.usecase.ts`
   - `search-workouts-by-user.usecase.ts`
   - `search-exercises-by-user.usecase.ts`
   - `search-all-exercise-metrics.usecase.ts`

5. **Phase 5: Command Use Cases**
   - `create-routine.usecase.ts`
   - `update-routine.usecase.ts`
   - `delete-routine.usecase.ts`
   - `start-workout-from-routine.usecase.ts`
   - `discard-workout.usecase.ts`
   - `finish-workout.usecase.ts`
