# Exercise Metrics Module

System-defined reference data. Describes the types of metrics that can be tracked for exercises (e.g., "Reps", "Weight", "Duration"). Potentially user-defined in the future.

---

MetricType vo
  values: count | weight | duration | distance

ExerciseMetricId vo

ExerciseMetricName vo

ExerciseMetricRelation vo
  values: direct | inverse

ExerciseMetric ag
  - id: ExerciseMetricId
  - name: ExerciseMetricName
  - type: MetricType
  - relation: ExerciseMetricRelation

  methods:
    create(data) -> ExerciseMetric

ExerciseMetricRepository repository
  - save(metric: ExerciseMetric) -> void
  - search(id: ExerciseMetricId) -> ExerciseMetric | null
  - searchAll() -> ExerciseMetric[]

---

## Use Cases

SearchAllExerciseMetrics () -> ExerciseMetricPrimitives[]
  [ExerciseMetricRepository]

  happy:
    base: returns all exercise metrics as primitives
    scenarios:
      - with multiple metrics in the system
      - with empty metrics list

---

## Design Decisions

1. **Reference data**: ExerciseMetrics are system-defined, not user-created.
2. **Relation field**: `direct` means higher is better (e.g., weight lifted), `inverse` means lower is better (e.g., time to complete).
3. **No user ownership**: Metrics are global, shared across all users.
