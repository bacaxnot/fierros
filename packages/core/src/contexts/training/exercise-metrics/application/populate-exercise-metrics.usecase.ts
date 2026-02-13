import { InferDependencies } from "../../../../../di/autoregister";
import { ExerciseMetric } from "../domain/exercise-metric";
import { ExerciseMetricId } from "../domain/exercise-metric-id";
import { ExerciseMetricName } from "../domain/exercise-metric-name";
import type { ExerciseMetricRepository } from "../domain/exercise-metric-repository";

const SEED_METRICS = [
  { name: "Reps", type: "count", relation: "direct" },
  { name: "Weight", type: "weight", relation: "direct" },
  { name: "Duration", type: "duration", relation: "direct" },
  { name: "Distance", type: "distance", relation: "direct" },
  { name: "Rest Time", type: "duration", relation: "inverse" },
  { name: "RPE", type: "count", relation: "direct" },
] as const;

@InferDependencies()
export class PopulateExerciseMetrics {
  constructor(private readonly repository: ExerciseMetricRepository) {}

  async execute(): Promise<void> {
    const existing = await this.repository.searchAll();
    const existingNames = existing.map(
      (m) => new ExerciseMetricName(m.toPrimitives().name),
    );

    const missing = SEED_METRICS.filter(
      (seed) =>
        !existingNames.some((name) =>
          name.equals(new ExerciseMetricName(seed.name)),
        ),
    );

    for (const seed of missing) {
      const metric = ExerciseMetric.create({
        id: new ExerciseMetricId().value,
        name: seed.name,
        type: seed.type,
        relation: seed.relation,
      });
      await this.repository.save(metric);
    }
  }
}
