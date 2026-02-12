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
  - searchByUserId(userId: UserId) -> Exercise[]
  - delete(id: ExerciseId) -> void

---

## Use Cases

SearchExercisesByUser ({ userId: string }) -> ExercisePrimitives[]
  [ExerciseRepository]

  happy:
    base: returns user exercises and system exercises as primitives
    scenarios:
      - with user-created exercises
      - with only system exercises (no user exercises)

---

## Design Decisions

1. **Nullable userId**: `null` means system-defined exercise (available to all users). Non-null means user-created.
2. **searchByUserId returns both**: Repository returns system exercises (userId = null) AND user-specific exercises.
3. **defaultMetrics is a UI hint**: Suggests which metrics to track, but RoutineSet can use any metrics.
4. **targetMuscles is embedded**: No separate aggregate — muscles are part of the exercise definition.
