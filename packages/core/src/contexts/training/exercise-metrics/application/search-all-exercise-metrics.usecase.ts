import { InferDependencies } from "../../../../../di/autoregister";
import type { ExerciseMetricPrimitives } from "../domain/exercise-metric";
import { ExerciseMetricRepository } from "../domain/exercise-metric-repository";

@InferDependencies()
export class SearchAllExerciseMetrics {
  constructor(private readonly repository: ExerciseMetricRepository) {}

  async execute(): Promise<ExerciseMetricPrimitives[]> {
    const metrics = await this.repository.searchAll();
    return metrics.map((metric) => metric.toPrimitives());
  }
}
