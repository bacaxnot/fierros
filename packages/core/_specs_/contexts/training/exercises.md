# Exercises Module

Exercises are the building blocks of routines and workouts. Can be system-defined (userId = null) or user-created.

---

MuscleGroup vo
  values: chest | upper_back | lats | shoulders | biceps | triceps | forearms | core | quads | hamstrings | glutes | calves | hip_flexors | adductors | abductors

MuscleInvolvement vo
  values: primary | secondary | stabilizer

ExerciseTargetMuscle vo
  - muscleGroup: MuscleGroup
  - involvement: MuscleInvolvement

ExerciseId vo

ExerciseName vo
  invariants:
    - must not be empty
    - must be under 100 characters

ExerciseDescription vo
  invariants:
    - must be under 500 characters

Exercise ag
  - id: ExerciseId
  - name: ExerciseName
  - description: ExerciseDescription | null
  - userId: UserId | null
  - targetMuscles: ExerciseTargetMuscle[]
  - defaultMetrics: ExerciseMetricId[]
  - createdAt: Date
  - updatedAt: Date

  methods:
    create(data) -> Exercise

ExerciseRepository repository
  - save(exercise: Exercise) -> void
  - search(id: ExerciseId) -> Exercise | null
  - searchByCriteria(criteria: Criteria) -> Exercise[]
  - countByCriteria(criteria: Criteria) -> number
  - delete(id: ExerciseId) -> void

---

## Use Cases

CreateExercise ({ id, userId, name, description, targetMuscles, defaultMetrics }) -> void
  [ExerciseRepository]

  happy:
    base: creates and persists a new exercise

SearchExercisesByCriteria ({ criteria: CriteriaPrimitives }) -> ExercisePrimitives[]
  [ExerciseRepository]

  happy:
    base: returns exercises matching criteria as primitives
    scenarios:
      - with exercises matching filters
      - with no exercises matching (empty list)

---

## Design Decisions

1. **Nullable userId**: `null` means system-defined exercise (available to all users). Non-null means user-created.
2. **Criteria-based search**: All listing queries use `searchByCriteria` with the shared Criteria pattern (filters, ordering, pagination).
3. **defaultMetrics is a UI hint**: Suggests which metrics to track, but RoutineSet can use any metrics.
4. **targetMuscles is embedded**: No separate aggregate — muscles are part of the exercise definition.
