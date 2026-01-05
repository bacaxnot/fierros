# Fierros Domain Model Implementation Plan

Implement the fitness tracking domain model in `packages/core/src/contexts/training/`.

Reference: `/Users/bxn/projects/code/fierros/specs/domain-model-v2.md`

## Folder Structure

```
packages/core/src/contexts/training/
├── shared/
│   └── domain/
│       ├── metric-unit.ts                # Value object
│       ├── metric-value.ts               # Value object
│       └── metric-value-range.ts         # Value object
├── users/
│   └── domain/
│       ├── user-id.ts                    # Value object (extends Id)
│       ├── user-name.ts                  # Value object
│       ├── user.ts                       # Aggregate root
│       └── user-repository.ts            # Abstract repository
├── exercise-metrics/
│   └── domain/
│       ├── metric-type.ts                # Value object ("count" | "weight" | "duration" | "distance")
│       ├── exercise-metric-id.ts         # Value object
│       ├── exercise-metric-name.ts       # Value object
│       ├── exercise-metric-relation.ts   # Value object ("direct" | "inverse")
│       ├── exercise-metric.ts            # Entity (reference data)
│       └── exercise-metric-repository.ts # Abstract repository
├── exercises/
│   └── domain/
│       ├── muscle-group.ts               # Value object
│       ├── muscle-involvement.ts         # Value object ("primary" | "secondary" | "stabilizer")
│       ├── exercise-target-muscle.ts     # Value object (embedded)
│       ├── exercise-id.ts                # Value object
│       ├── exercise-name.ts              # Value object
│       ├── exercise-description.ts       # Value object (nullable)
│       ├── exercise.ts                   # Aggregate root
│       └── exercise-repository.ts        # Abstract repository
├── routines/
│   └── domain/
│       ├── routine.ts                    # Aggregate root
│       ├── routine-id.ts                 # Value object
│       ├── routine-name.ts               # Value object
│       ├── routine-description.ts        # Value object (nullable)
│       ├── routine-block.ts              # Embedded entity
│       ├── routine-set.ts                # Value object (embedded in block)
│       ├── routine-set-metric.ts         # Value object (embedded in set)
│       └── routine-repository.ts         # Abstract repository
└── workouts/
    └── domain/
        ├── workout.ts                    # Aggregate root
        ├── workout-id.ts                 # Value object
        ├── workout-name.ts               # Value object
        ├── workout-block.ts              # Embedded entity
        ├── workout-set.ts                # Value object (embedded in block)
        ├── workout-set-metric.ts         # Value object (embedded in set)
        └── workout-repository.ts         # Abstract repository
```

## Implementation Order

### Phase 1: Shared Domain

1. `shared/domain/metric-unit.ts` - MetricUnit value object
2. `shared/domain/metric-value.ts` - MetricValue value object
3. `shared/domain/metric-value-range.ts` - MetricValueRange value object

### Phase 2: Users Module

1. `users/domain/user-id.ts` - UserId value object (extends Id)
2. `users/domain/user-name.ts` - UserName value object (validation: not empty, max length)
3. `users/domain/user.ts` - User aggregate root
4. `users/domain/user-repository.ts` - abstract save/search/delete

### Phase 3: ExerciseMetric Module (Reference Data)

1. `exercise-metrics/domain/metric-type.ts` - MetricType value object ("count" | "weight" | "duration" | "distance")
2. `exercise-metrics/domain/exercise-metric-id.ts` - extends Id
3. `exercise-metrics/domain/exercise-metric-name.ts` - validation (not empty, max length)
4. `exercise-metrics/domain/exercise-metric-relation.ts` - "direct" | "inverse"
5. `exercise-metrics/domain/exercise-metric.ts` - Entity with id, name, type, relation
6. `exercise-metrics/domain/exercise-metric-repository.ts` - abstract search/searchAll

### Phase 4: Exercise Module

1. `exercises/domain/muscle-group.ts` - MuscleGroup value object
2. `exercises/domain/muscle-involvement.ts` - MuscleInvolvement value object ("primary" | "secondary" | "stabilizer")
3. `exercises/domain/exercise-target-muscle.ts` - { muscleGroup, involvement }
4. `exercises/domain/exercise-id.ts` - extends Id
5. `exercises/domain/exercise-name.ts` - validation (not empty, max length)
6. `exercises/domain/exercise-description.ts` - optional, max length
7. `exercises/domain/exercise.ts` - Aggregate with embedded targetMuscles[], defaultMetrics[]
8. `exercises/domain/exercise-repository.ts` - abstract save/search/searchByUserId/delete

### Phase 5: Routine Module

1. `routines/domain/routine-id.ts` - extends Id
2. `routines/domain/routine-name.ts` - validation (not empty, max length)
3. `routines/domain/routine-description.ts` - optional, max length
4. `routines/domain/routine-set-metric.ts` - { metricId, targetRange?, targetValue?, lastValue? }
5. `routines/domain/routine-set.ts` - { order, exerciseId, notes?, restTime?, metrics[] }
6. `routines/domain/routine-block.ts` - { order, notes?, defaultRestTime?, sets[] }
7. `routines/domain/routine.ts` - Aggregate with embedded blocks[]
8. `routines/domain/routine-repository.ts` - abstract save/search/searchByUserId/delete

### Phase 6: Workout Module

1. `workouts/domain/workout-id.ts` - extends Id
2. `workouts/domain/workout-name.ts` - validation (not empty, max length)
3. `workouts/domain/workout-set-metric.ts` - { metricId, value, targetRange?, targetValue? }
4. `workouts/domain/workout-set.ts` - { order, exerciseId, notes?, startedAt?, finishedAt?, restTime?, metrics[] }
5. `workouts/domain/workout-block.ts` - { order, notes?, startedAt?, finishedAt?, sets[] }
6. `workouts/domain/workout.ts` - Aggregate with start/finish logic, embedded blocks[]
7. `workouts/domain/workout-repository.ts` - abstract save/search/searchByUserId/delete

## Patterns to Follow

### Value Object Pattern (from finance/account-name.ts)
```typescript
export class ExerciseName {
  public readonly value: string;

  constructor(value: string) {
    this.ensureIsNotEmpty(value);
    this.ensureHasValidLength(value);
    this.value = value.trim();
  }

  private ensureIsNotEmpty(value: string): void { ... }
  private ensureHasValidLength(value: string): void { ... }

  equals(other: ExerciseName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
```

### Embedded Value Object Pattern (new)
```typescript
export type ExerciseTargetMusclePrimitives = {
  muscleGroup: string;
  involvement: string;
};

export class ExerciseTargetMuscle {
  constructor(
    public readonly muscleGroup: MuscleGroup,
    public readonly involvement: MuscleInvolvement,
  ) {}

  static fromPrimitives(p: ExerciseTargetMusclePrimitives): ExerciseTargetMuscle {
    return new ExerciseTargetMuscle(
      MuscleGroup.fromValue(p.muscleGroup),
      new MuscleInvolvement(p.involvement),
    );
  }

  toPrimitives(): ExerciseTargetMusclePrimitives {
    return {
      muscleGroup: this.muscleGroup.value,
      involvement: this.involvement.value,
    };
  }
}
```

### Aggregate with Embedded Entities Pattern (new)
```typescript
export type RoutinePrimitives = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  blocks: RoutineBlockPrimitives[];
  createdAt: string;
  updatedAt: string;
};

export class Routine extends AggregateRoot {
  private constructor(
    private readonly id: RoutineId,
    private name: RoutineName,
    private description: RoutineDescription | null,
    private readonly userId: UserId,
    private blocks: RoutineBlock[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: { ... }): Routine { ... }

  static fromPrimitives(p: RoutinePrimitives): Routine {
    return new Routine(
      new RoutineId(p.id),
      new RoutineName(p.name),
      p.description ? new RoutineDescription(p.description) : null,
      new UserId(p.userId),
      p.blocks.map(RoutineBlock.fromPrimitives),
      dateFromPrimitive(p.createdAt),
      dateFromPrimitive(p.updatedAt),
    );
  }

  toPrimitives(): RoutinePrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description?.value ?? null,
      userId: this.userId.value,
      blocks: this.blocks.map(b => b.toPrimitives()),
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
```

### Embedded Entity Pattern (new)
```typescript
export type RoutineBlockPrimitives = {
  order: number;
  notes: string | null;
  defaultRestTime: number | null;
  sets: RoutineSetPrimitives[];
};

export class RoutineBlock {
  private constructor(
    private order: number,
    private notes: string | null,
    private defaultRestTime: number | null,
    private sets: RoutineSet[],
  ) {}

  static fromPrimitives(p: RoutineBlockPrimitives): RoutineBlock {
    return new RoutineBlock(
      p.order,
      p.notes,
      p.defaultRestTime,
      p.sets.map(RoutineSet.fromPrimitives),
    );
  }

  toPrimitives(): RoutineBlockPrimitives {
    return {
      order: this.order,
      notes: this.notes,
      defaultRestTime: this.defaultRestTime,
      sets: this.sets.map(s => s.toPrimitives()),
    };
  }
}
```

### Repository Pattern (from finance/account-repository.ts)
```typescript
export abstract class RoutineRepository {
  abstract save(routine: Routine): Promise<void>;
  abstract search(id: RoutineId): Promise<Routine | null>;
  abstract searchByUserId(userId: UserId): Promise<Routine[]>;
  abstract delete(id: RoutineId): Promise<void>;
}
```

### Enum-like Value Object Pattern (new)
```typescript
const VALID_METRIC_TYPES = ["count", "weight", "duration", "distance"] as const;
type MetricTypeValue = typeof VALID_METRIC_TYPES[number];

export class MetricType {
  public readonly value: MetricTypeValue;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value as MetricTypeValue;
  }

  private ensureIsValid(value: string): void {
    if (!VALID_METRIC_TYPES.includes(value as MetricTypeValue)) {
      throw new InvalidArgumentError(
        `Invalid metric type: ${value}. Valid types: ${VALID_METRIC_TYPES.join(", ")}`
      );
    }
  }

  equals(other: MetricType): boolean {
    return this.value === other.value;
  }
}
```

## Files to Create (36 files)

| Phase | Path | Type |
|-------|------|------|
| 1 | `shared/domain/metric-unit.ts` | Value Object |
| 1 | `shared/domain/metric-value.ts` | Value Object |
| 1 | `shared/domain/metric-value-range.ts` | Value Object |
| 2 | `users/domain/user-id.ts` | Value Object |
| 2 | `users/domain/user-name.ts` | Value Object |
| 2 | `users/domain/user.ts` | Aggregate |
| 2 | `users/domain/user-repository.ts` | Repository |
| 3 | `exercise-metrics/domain/metric-type.ts` | Value Object |
| 3 | `exercise-metrics/domain/exercise-metric-id.ts` | Value Object |
| 3 | `exercise-metrics/domain/exercise-metric-name.ts` | Value Object |
| 3 | `exercise-metrics/domain/exercise-metric-relation.ts` | Value Object |
| 3 | `exercise-metrics/domain/exercise-metric.ts` | Entity |
| 3 | `exercise-metrics/domain/exercise-metric-repository.ts` | Repository |
| 4 | `exercises/domain/muscle-group.ts` | Value Object |
| 4 | `exercises/domain/muscle-involvement.ts` | Value Object |
| 4 | `exercises/domain/exercise-target-muscle.ts` | Value Object |
| 4 | `exercises/domain/exercise-id.ts` | Value Object |
| 4 | `exercises/domain/exercise-name.ts` | Value Object |
| 4 | `exercises/domain/exercise-description.ts` | Value Object |
| 4 | `exercises/domain/exercise.ts` | Aggregate |
| 4 | `exercises/domain/exercise-repository.ts` | Repository |
| 5 | `routines/domain/routine-id.ts` | Value Object |
| 5 | `routines/domain/routine-name.ts` | Value Object |
| 5 | `routines/domain/routine-description.ts` | Value Object |
| 5 | `routines/domain/routine-set-metric.ts` | Value Object |
| 5 | `routines/domain/routine-set.ts` | Value Object |
| 5 | `routines/domain/routine-block.ts` | Embedded Entity |
| 5 | `routines/domain/routine.ts` | Aggregate |
| 5 | `routines/domain/routine-repository.ts` | Repository |
| 6 | `workouts/domain/workout-id.ts` | Value Object |
| 6 | `workouts/domain/workout-name.ts` | Value Object |
| 6 | `workouts/domain/workout-set-metric.ts` | Value Object |
| 6 | `workouts/domain/workout-set.ts` | Value Object |
| 6 | `workouts/domain/workout-block.ts` | Embedded Entity |
| 6 | `workouts/domain/workout.ts` | Aggregate |
| 6 | `workouts/domain/workout-repository.ts` | Repository |
