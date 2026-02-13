import type { ExerciseMetric } from "./exercise-metric";
import type { ExerciseMetricId } from "./exercise-metric-id";

export abstract class ExerciseMetricRepository {
  abstract save(metric: ExerciseMetric): Promise<void>;
  abstract search(id: ExerciseMetricId): Promise<ExerciseMetric | null>;
  abstract searchAll(): Promise<ExerciseMetric[]>;
}
