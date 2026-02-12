import { mock } from "bun:test";
import type { ExerciseMetric } from "../../../../../src/contexts/training/exercise-metrics/domain/exercise-metric";
import { ExerciseMetricRepository } from "../../../../../src/contexts/training/exercise-metrics/domain/exercise-metric-repository";

export class MockExerciseMetricRepository extends ExerciseMetricRepository {
  readonly search = mock(() => {});
  readonly searchAll = mock(() => {});

  returnOnSearchAll(metrics: ExerciseMetric[]): void {
    this.searchAll.mockResolvedValue(metrics);
  }
}
