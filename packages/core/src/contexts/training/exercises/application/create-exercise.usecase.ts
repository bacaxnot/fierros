import { InferDependencies } from "../../../../../di/autoregister";
import { Exercise } from "../domain/exercise";
import { ExerciseRepository } from "../domain/exercise-repository";
import type { ExerciseTargetMusclePrimitives } from "../domain/exercise-target-muscle";

@InferDependencies()
export class CreateExercise {
  constructor(private readonly repository: ExerciseRepository) {}

  async execute(payload: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    targetMuscles: ExerciseTargetMusclePrimitives[];
    defaultMetrics: string[];
  }): Promise<void> {
    const exercise = Exercise.create({
      id: payload.id,
      name: payload.name,
      description: payload.description,
      userId: payload.userId,
      targetMuscles: payload.targetMuscles,
      defaultMetrics: payload.defaultMetrics,
    });

    await this.repository.save(exercise);
  }
}
