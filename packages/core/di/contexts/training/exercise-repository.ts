import type { ContainerBuilder } from "diod";
import { ExerciseRepository } from "../../../src/contexts/training/exercises/domain/exercise-repository";
import { DrizzleExerciseRepository } from "../../../src/contexts/training/exercises/infrastructure/drizzle-exercise-repository";

export function register(builder: ContainerBuilder) {
  builder.register(ExerciseRepository).use(DrizzleExerciseRepository);
}
