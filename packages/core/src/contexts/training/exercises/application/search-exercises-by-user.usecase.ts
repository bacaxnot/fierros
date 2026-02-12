import { InferDependencies } from "../../../../../di/autoregister";
import { UserId } from "../../users/domain/user-id";
import type { ExercisePrimitives } from "../domain/exercise";
import { ExerciseRepository } from "../domain/exercise-repository";

@InferDependencies()
export class SearchExercisesByUser {
  constructor(private readonly repository: ExerciseRepository) {}

  async execute(params: { userId: string }): Promise<ExercisePrimitives[]> {
    const userId = new UserId(params.userId);
    const exercises = await this.repository.searchByUserId(userId);
    return exercises.map((exercise) => exercise.toPrimitives());
  }
}
