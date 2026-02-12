import type { ContainerBuilder } from "diod";
import { WorkoutRepository } from "../../../src/contexts/training/workouts/domain/workout-repository";
import { DrizzleWorkoutRepository } from "../../../src/contexts/training/workouts/infrastructure/drizzle-workout-repository";

export function register(builder: ContainerBuilder) {
  builder.register(WorkoutRepository).use(DrizzleWorkoutRepository);
}
