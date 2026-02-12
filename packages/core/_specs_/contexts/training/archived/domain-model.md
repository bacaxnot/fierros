# Domain Model

## Core Entities

### User
```
├── id (value object)
└── name (value object)
```

### ExerciseMetric (reference data - system defined)
```
├── id (value object)
├── name (value object)
├── type (value object) ("count" | "weight" | "duration" | "distance")
└── relation (value object) ("direct" | "inverse")
```

### Exercise (aggregate root)
```
├── id (value object)
├── name (value object)
├── description (value object) (nullable)
├── userId (value object) (nullable - null means system-defined)
├── targetMuscles: ExerciseTargetMuscle[] (embedded)
└── defaultMetrics: ExerciseMetricId[] (references - UI hint only, not enforced)
```

#### ExerciseTargetMuscle (value object)
```
├── muscleGroup (value object) ("upper_pecs" | "lower_pecs" | "lats" | "upper_back" | "quads" | "hamstrings" | ...)
└── involvement (value object) ("primary" | "secondary" | "stabilizer")
```

### Routine (aggregate root)
```
├── id (value object)
├── name (value object)
├── description (value object) (nullable)
├── userId (value object)
└── blocks: RoutineBlock[] (embedded)
```

#### RoutineBlock (embedded entity)
```
├── order (value object)
├── notes (nullable)
├── defaultRestTime (value object) (nullable)
└── sets: RoutineSet[] (embedded)
```

#### RoutineSet (value object)
```
├── order (value object)
├── exerciseId (value object)
├── notes (nullable)
├── restTime (value object) (nullable - overrides block default)
└── metrics: RoutineSetMetric[] (embedded)
```

#### RoutineSetMetric (value object)
```
├── metricId (value object)
├── targetRange: MetricValueRange (nullable)
├── targetValue: MetricValue (nullable)
└── lastValue: MetricValue (nullable - populated from last workout)
```

### Workout (aggregate root)
```
├── id (value object)
├── userId (value object)
├── routineId (value object) (nullable - null means ad-hoc workout)
├── name (value object)
├── startedAt (value object)
├── finishedAt (value object) (nullable)
├── notes (nullable)
└── blocks: WorkoutBlock[] (embedded)
```

#### WorkoutBlock (embedded entity)
```
├── order (value object)
├── notes (nullable)
├── startedAt (value object) (nullable)
├── finishedAt (value object) (nullable)
└── sets: WorkoutSet[] (embedded)
```

#### WorkoutSet (value object)
```
├── order (value object)
├── exerciseId (value object)
├── notes (nullable)
├── startedAt (value object) (nullable)
├── finishedAt (value object) (nullable)
├── restTime (value object) (nullable - effective/computed value)
└── metrics: WorkoutSetMetric[] (embedded)
```

#### WorkoutSetMetric (value object)
```
├── metricId (value object)
├── value: MetricValue (the actual recorded value)
├── targetRange: MetricValueRange (nullable - copied from routine for display)
└── targetValue: MetricValue (nullable - copied from routine for display)
```

## Shared Value Objects

#### MetricUnit (value object)
```
└── value ("quantity" | "seconds" | "milliseconds" | "kilograms" | "pounds" | "meters" | "kilometers" | ...)
```

#### MetricValue (value object)
```
├── value: number
└── unit: MetricUnit
```

#### MetricValueRange (value object)
```
├── min: MetricValue (nullable)
└── max: MetricValue (nullable)
```

## Design Decisions

1. **Embedded entities over separate aggregates**: Blocks and Sets are embedded within their parent aggregates (Routine/Workout). No separate repositories needed.

2. **No IDs on embedded entities**: Blocks and Sets are identified by their `order` within the parent. This simplifies the model and avoids over-normalization.

3. **No type duplication**: `RoutineSetMetric` and `WorkoutSetMetric` don't duplicate the metric type - it's always looked up from `ExerciseMetric` via `metricId`.

4. **WorkoutSetMetric captures actual values**: Unlike `RoutineSetMetric` (which has targets), `WorkoutSetMetric` stores the actual recorded `value` plus optional targets for comparison UI.

5. **defaultMetrics is a UI hint**: Exercise's `defaultMetrics` suggests which metrics to track, but RoutineSet can use any metrics.

6. **Rest time inheritance**: `RoutineBlock.defaultRestTime` is the template default, `RoutineSet.restTime` overrides it, `WorkoutSet.restTime` stores the effective/computed value.

7. **ExerciseMetric is reference data**: System-defined for now, potentially user-defined in the future.
