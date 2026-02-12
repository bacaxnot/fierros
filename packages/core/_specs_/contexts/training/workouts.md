# Workouts Module

A workout is a recorded training session. Workouts can be started from a routine (copying the routine's structure) or created ad-hoc. They track actual values for each set metric.

---

WorkoutId vo

WorkoutName vo
  invariants:
    - must not be empty
    - must be under 100 characters

WorkoutSetMetric vo
  - metricId: ExerciseMetricId
  - value: MetricValue | null
  - targetRange: MetricValueRange | null
  - targetValue: MetricValue | null

WorkoutSet vo
  - order: number
  - exerciseId: ExerciseId
  - notes: string | null
  - startedAt: Date | null
  - finishedAt: Date | null
  - restTime: number | null
  - metrics: WorkoutSetMetric[]

WorkoutBlock vo
  - order: number
  - notes: string | null
  - startedAt: Date | null
  - finishedAt: Date | null
  - sets: WorkoutSet[]

Workout ag
  - id: WorkoutId
  - userId: UserId
  - routineId: RoutineId | null
  - name: WorkoutName
  - startedAt: Date
  - finishedAt: Date | null
  - notes: string | null
  - blocks: WorkoutBlock[]
  - createdAt: Date
  - updatedAt: Date

  methods:
    create(data) -> Workout
    finish() -> void
    belongsTo(userId: string) -> boolean
    isFinished() -> boolean

WorkoutRepository repository
  - save(workout: Workout) -> void
  - search(id: WorkoutId) -> Workout | null
  - searchByCriteria(criteria: Criteria) -> Workout[]
  - countByCriteria(criteria: Criteria) -> number
  - delete(id: WorkoutId) -> void

---

## Errors

WorkoutDoesNotExistError<NotFound> (workoutId)
  "The workout {workoutId} does not exist"

WorkoutAlreadyFinishedError<Conflict> (workoutId)
  "The workout {workoutId} is already finished"

---

## Use Cases

FindWorkout ({ id: string }) -> Workout
  [WorkoutRepository]

  happy:
    base: finds and returns the workout
    scenarios:
      - with existing workout

  guards:
    - rejects if workout does not exist -> WorkoutDoesNotExistError

SearchWorkoutsByCriteria ({ criteria: CriteriaPrimitives }) -> WorkoutPrimitives[]
  [WorkoutRepository]

  happy:
    base: returns workouts matching criteria as primitives
    scenarios:
      - with workouts matching filters
      - with no workouts matching (empty list)

StartWorkoutFromRoutine ({
  workoutId: string,
  userId: string,
  routineId: string
}) -> void
  [WorkoutRepository, FindRoutine]

  happy:
    base: finds routine, copies structure to workout blocks, persists workout
    scenarios:
      - with routine that has blocks and sets with metrics
      - with routine that has sets with rest time overrides

  guards:
    - rejects if routine does not exist -> RoutineDoesNotExistError
    - rejects if routine does not belong to user

DiscardWorkout ({ userId: string, workoutId: string }) -> void
  [WorkoutRepository, FindWorkout]

  happy:
    base: finds workout, verifies ownership and not finished, deletes
    scenarios:
      - with ongoing workout owned by user

  guards:
    - rejects if workout does not exist -> WorkoutDoesNotExistError
    - rejects if workout does not belong to user
    - rejects if workout is already finished -> WorkoutAlreadyFinishedError

FinishWorkout ({ userId: string, workoutId: string }) -> void
  [WorkoutRepository, FindWorkout]

  happy:
    base: finds workout, verifies ownership and not finished, sets finishedAt, persists
    scenarios:
      - with ongoing workout owned by user

  guards:
    - rejects if workout does not exist -> WorkoutDoesNotExistError
    - rejects if workout does not belong to user
    - rejects if workout is already finished -> WorkoutAlreadyFinishedError

---

## Design Decisions

1. **Nullable routineId**: `null` means ad-hoc workout (not based on a routine).
2. **StartWorkoutFromRoutine copies structure**: Routine blocks/sets/metrics are copied into the workout. Changes to the routine after starting don't affect the workout.
3. **Rest time in WorkoutSet is effective**: Computed from `RoutineSet.restTime ?? RoutineBlock.defaultRestTime` at workout creation time.
4. **WorkoutSetMetric.value is nullable**: Starts null, gets filled as the user records actual values.
5. **targetRange/targetValue copied from routine**: For display purposes so the user can see targets while recording.
6. **finish() sets finishedAt**: Once finished, a workout cannot be modified or discarded.
7. **Timestamps on blocks/sets**: `startedAt`/`finishedAt` on WorkoutBlock and WorkoutSet are optional — used for time tracking during the session.
