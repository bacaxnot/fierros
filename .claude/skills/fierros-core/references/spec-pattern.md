# Core Domain Spec Pattern

A high-level pseudolanguage for domain modeling. Focused on business rules and design, not implementation details.

## File Location

```
packages/core/_specs_/
├── contexts/
│   └── <context>/
│       └── <module>.md        # Module spec
└── shared/
    ├── errors.md
    └── ...
```

---

## Value Object (vo)

Immutable types with self-contained validation.

**Simple:**
```
ExerciseName vo
```

**With enum values:**
```
RoutineFrequency vo
  values: daily | weekly | biweekly | monthly | custom
```

**With invariants:**
```
SetCount vo
  invariants:
    - must be positive
    - must be under 100
```

**Complex (composed of fields):**
```
ExerciseMetric vo
  - sets: number
  - reps: number | null
  - weight: number | null
  - duration: number | null
  - unit: string
```

---

## Aggregate (ag)

Entities with identity, fields, invariants, and methods.

```
Routine ag
  - id: RoutineId
  - userId: UserId
  - name: RoutineName
  - frequency: RoutineFrequency
  - exercises: RoutineExercise[]
  - isActive: boolean

  invariants:
    - must have at least one exercise

  methods:
    create(data) -> Routine -> emits RoutineCreatedEvent
    updateName(name) -> void -> emits RoutineNameUpdatedEvent
    addExercise(exercise) -> void -> emits RoutineExerciseAddedEvent
    belongsTo(userId: string) -> boolean
```

**Notes:**
- Fields use `| null` for optional
- Arrays use `Type[]`
- Invariants are cross-field business rules
- Methods: `name(params) -> ReturnType` or `name(params) -> ReturnType -> emits EventName`
- Multiple events: `-> emits EventA, EventB`

**Timestamp pattern:** When methods need to set timestamps (createdAt, updatedAt), separate them from business params:
```
create({id: string, authId: string}, timestamp: string) -> User -> emits UserCreatedEvent
update({field: string}, timestamp: string) -> void -> emits UpdatedEvent
```

---

## Use Case

Single business operation with collaborators and tests.

```
CreateWorkout ({
  routineId: RoutineId,
  userId: UserId,
  exercises: WorkoutExercise[]
}) -> Workout
  [WorkoutRepository, RoutineRepository, EventBus]

  happy:
    base: creates workout, persists, publishes WorkoutCreatedEvent
    scenarios:
      - with full routine exercises
      - with partial routine exercises
      - with custom exercises

  guards:
    - rejects if routine does not exist -> RoutineNotFoundError
    - rejects if workout already exists -> WorkoutAlreadyExistsError

  validation:
    - routineId must be valid
    - userId must be valid
```

**Syntax:**
- `()` for separate params, `({})` for object param
- `[Collaborators]` - repositories, gateways, other use cases
- `happy:` - success path tests
  - `base:` - common expected behavior for all happy scenarios
  - `scenarios:` - variations to test (each inherits base assertions)
- `guards:` - business rule violations (state/context checks, not input)
- `validation:` - input validation checks (one test, multiple asserts)
- `test-entry:` - optional, specifies entry point when tested via subscriber

**Test order:** happy -> guards -> validation (validation last for readability)

**test-entry:**
When a use case is only called by a subscriber (not exposed via API):
```
SendWorkoutSummary ({...}) -> void
  [NotificationSender, EventBus]

  test-entry: SendWorkoutSummaryOnWorkoutCompleted

  happy:
    base: sends summary, publishes WorkoutSummarySentEvent
    scenarios:
      - with standard workout
```

**Return types can be inline objects:**
```
GetRoutineWithExercises (routineId: RoutineId) -> {
  routine: Routine,
  exercises: Exercise[]
}
```

---

## Subscriber

Listens to domain events, calls exactly one use case.

**Naming convention:** `{UseCaseName}On{EventName}`

```
LogWorkoutOnRoutineActivated subscriber
  listens: RoutineActivatedEvent
  calls: LogWorkout
```

**Multiple events, one use case:**
```
SyncRoutineToExternalSystemOnRoutineChanged subscriber
  listens:
    - RoutineCreatedEvent
    - RoutineUpdatedEvent
  calls: SyncRoutineToExternalSystem
```

---

## Gateway

Interface for external services (ports to outside world).

```
FitnessAnalyticsGateway gateway
  - analyzePerformance(workouts: Workout[]) -> PerformanceSummary
  - suggestProgression(exercise: Exercise, history: WorkoutExercise[]) -> ProgressionSuggestion
```

---

## Clock Pattern

For testable time handling, use a Clock gateway with Timestamp value object (defined in `shared/clock.md`).

**In use cases:** Add Clock as a collaborator when the operation sets timestamps.
```
CreateUser ({id: string, authId: string}) -> void
  [UserRepository, EventBus, Clock]
```

**In aggregates:** Store as Timestamp, receive as string in methods.
```
User ag
  - createdAt: Timestamp

  methods:
    create({id: string, authId: string}, timestamp: string) -> User
```

---

## Repository

Persistence interface for aggregates.

```
RoutineRepository repository
  - save(routine: Routine) -> void
  - findById(id: RoutineId) -> Routine | null
  - findByUserId(userId: UserId) -> Routine[]
```

---

## Service

Stateless or stateful services with public interface only.

```
WorkoutProgressTracker service (singleton)
  - subscribe(userId: string, callback: (event: WorkoutProgressEvent) -> Promise<void>) -> void
  - unsubscribe(userId: string, callback) -> void
  - forward(event: WorkoutProgressEvent) -> void
```

**Notes:**
- `(singleton)` marker for stateful services that must be shared
- Only list public methods, not internal state

---

## Event

Domain events with payload. Events are serialized for transport, so field types must be serialization-friendly.

**Type rules for event fields and use case params (serialized representations):**
- **IDs** -> `string` (e.g., `RoutineId` becomes `string`)
- **Simple wrapper types (enums)** -> use domain type with `Type` suffix (e.g., `RoutineFrequency` becomes `RoutineFrequencyType`, `ExerciseCategory` becomes `ExerciseCategoryType`)
- **Complex VOs** -> use with `Type` suffix (e.g., `ExerciseMetric` becomes `ExerciseMetricType`)
- **Timestamps** -> `string` (ISO 8601)

These rules apply to both event payloads and use case parameters that receive serialized/primitive values.

```
UserCreatedEvent event
  - id: string
  - authId: string
  - createdAt: string

RoutineCreatedEvent event
  - id: string
  - userId: string
  - name: string
  - frequency: RoutineFrequencyType     // simple enum: use domain type
  - exercises: RoutineExerciseType[]     // complex VO: add Type suffix
  - createdAt: string
```

---

## Error

Domain errors with category, params, and message.

**Categories:** `NotFound`, `Conflict`, `Validation`

```
RoutineNotFoundError<NotFound> (routineId)
  "Routine {routineId} was not found"

WorkoutAlreadyExistsError<Conflict> (workoutId)
  "A workout with id {workoutId} already exists"

InvalidArgumentError<Validation> (message)
  "{message}"
```

---

## Module Boundaries

Types from other modules are used directly (implicit imports). Dependencies are resolved at implementation time.

```
Workout ag
  - userId: UserId        // from users module
  - routineId: RoutineId  // from routines module
```

---

## Quick Reference

| Element | Marker | Purpose |
|---------|--------|---------|
| Value Object | `vo` | Immutable, self-validating |
| Aggregate | `ag` | Entity with identity and behavior |
| Use Case | (none) | Single business operation |
| Subscriber | `subscriber` | Event listener, calls one use case |
| Gateway | `gateway` | External service interface |
| Repository | `repository` | Persistence interface |
| Service | `service` | Shared service (add `(singleton)` if stateful) |
| Event | `event` | Domain event with payload |
| Error | `<Category>` | NotFound, Conflict, Validation |
| Test | `happy:`, `guards:`, `validation:` | Behavior specifications in use case |

## Relationships

- Nullable: `type | null`
- Array: `Type[]`
- Reference to other aggregate: `OtherId` (ID type)
- Embedded: Just list the type directly

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Aggregate | PascalCase, noun | `Routine` |
| Value Object | PascalCase, noun | `ExerciseMetric` |
| ID | `<Entity>Id` | `RoutineId` |
| Use Case | `<Action><Entity>` | `CreateRoutine` |
| Event | `<Entity><Action>Event` | `RoutineCreatedEvent` |
| Error | `<Entity><Issue>Error` | `RoutineNotFoundError` |

## Spec Principles

- **Contracts only**: Specs define public interfaces, not internal implementation
- **No internal state**: Don't include private fields, maps, caches in specs
- **Merge by type**: Group use cases together, subscribers together - don't create separate sections per feature
