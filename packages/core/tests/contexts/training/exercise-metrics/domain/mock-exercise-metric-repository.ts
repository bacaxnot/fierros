import { mock } from "bun:test";
import type { ExerciseMetric } from "../../../../../src/contexts/training/exercise-metrics/domain/exercise-metric";
import { ExerciseMetricRepository } from "../../../../../src/contexts/training/exercise-metrics/domain/exercise-metric-repository";

export class MockExerciseMetricRepository extends ExerciseMetricRepository {
  readonly search = mock((): Promise<ExerciseMetric | null> => Promise.resolve(null));
  readonly searchAll = mock((): Promise<ExerciseMetric[]> => Promise.resolve([]));

  returnOnSearchAll(metrics: ExerciseMetric[]): void {
    this.searchAll.mockResolvedValue(metrics);
  }
}
