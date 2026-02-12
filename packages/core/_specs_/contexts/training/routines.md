# Routines Module

A routine is a workout template that defines the structure of blocks, sets, exercises, and target metrics. Users create routines and then start workouts from them.

---

RoutineId vo

RoutineName vo
  invariants:
    - must not be empty
    - must be under 100 characters

RoutineDescription vo
  invariants:
    - must be under 500 characters

RoutineSetMetric vo
  - metricId: ExerciseMetricId
  - targetRange: MetricValueRange | null
  - targetValue: MetricValue | null
  - lastValue: MetricValue | null

RoutineSet vo
  - order: number
  - exerciseId: ExerciseId
  - notes: string | null
  - restTime: number | null
  - metrics: RoutineSetMetric[]

RoutineBlock vo
  - order: number
  - notes: string | null
  - defaultRestTime: number | null
  - sets: RoutineSet[]

Routine ag
  - id: RoutineId
  - name: RoutineName
  - description: RoutineDescription | null
  - userId: UserId
  - blocks: RoutineBlock[]
  - createdAt: Date
  - updatedAt: Date

  methods:
    create(data) -> Routine
    updateName(name) -> void
    updateDescription(description) -> void
    updateBlocks(blocks) -> void
    belongsTo(userId: string) -> boolean

RoutineRepository repository
  - save(routine: Routine) -> void
  - search(id: RoutineId) -> Routine | null
  - searchByUserId(userId: UserId) -> Routine[]
  - delete(id: RoutineId) -> void

---

## Errors

RoutineDoesNotExistError<NotFound> (routineId)
  "The routine {routineId} does not exist"

---

## Use Cases

FindRoutine ({ id: string }) -> Routine
  [RoutineRepository]

  happy:
    base: finds and returns the routine
    scenarios:
      - with existing routine

  guards:
    - rejects if routine does not exist -> RoutineDoesNotExistError

SearchRoutinesByUser ({ userId: string }) -> RoutinePrimitives[]
  [RoutineRepository]

  happy:
    base: returns all routines for the user as primitives
    scenarios:
      - with multiple routines
      - with no routines (empty list)

CreateRoutine ({
  id: string,
  userId: string,
  name: string,
  description: string | null,
  blocks: RoutineBlockPrimitives[]
}) -> void
  [RoutineRepository]

  happy:
    base: creates routine and persists it
    scenarios:
      - with blocks and sets
      - with empty blocks

UpdateRoutine ({
  userId: string,
  routineId: string,
  name: string | undefined,
  description: string | null | undefined,
  blocks: RoutineBlockPrimitives[] | undefined
}) -> void
  [RoutineRepository, FindRoutine]

  happy:
    base: finds routine, updates fields, persists
    scenarios:
      - updating name only
      - updating blocks only
      - updating all fields

  guards:
    - rejects if routine does not exist -> RoutineDoesNotExistError
    - rejects if routine does not belong to user

DeleteRoutine ({ userId: string, routineId: string }) -> void
  [RoutineRepository, FindRoutine]

  happy:
    base: finds routine, verifies ownership, deletes
    scenarios:
      - with existing routine owned by user

  guards:
    - rejects if routine does not exist -> RoutineDoesNotExistError
    - rejects if routine does not belong to user

---

## Design Decisions

1. **Embedded blocks/sets**: Blocks and sets are embedded within the Routine aggregate. No separate repositories.
2. **No IDs on embedded entities**: Blocks and sets are identified by `order` within the parent.
3. **Rest time inheritance**: `RoutineBlock.defaultRestTime` is the template default, `RoutineSet.restTime` overrides it per set.
4. **lastValue on RoutineSetMetric**: Populated from the last workout for display — helps users see previous performance.
5. **Ownership check**: Update and delete require `belongsTo()` verification.
