import type { ContainerBuilder } from "diod";
import { ExerciseMetricRepository } from "../../../src/contexts/training/exercise-metrics/domain/exercise-metric-repository";
import { DrizzleExerciseMetricRepository } from "../../../src/contexts/training/exercise-metrics/infrastructure/drizzle-exercise-metric-repository";

export function register(builder: ContainerBuilder) {
  builder.register(ExerciseMetricRepository).use(DrizzleExerciseMetricRepository);
}
