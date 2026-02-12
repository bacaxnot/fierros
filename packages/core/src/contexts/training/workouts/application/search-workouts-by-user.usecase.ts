import { InferDependencies } from "../../../../../di/autoregister";
import { UserId } from "../../users/domain/user-id";
import type { WorkoutPrimitives } from "../domain/workout";
import { WorkoutRepository } from "../domain/workout-repository";

@InferDependencies()
export class SearchWorkoutsByUser {
  constructor(private readonly repository: WorkoutRepository) {}

  async execute(params: { userId: string }): Promise<WorkoutPrimitives[]> {
    const userId = new UserId(params.userId);
    const workouts = await this.repository.searchByUserId(userId);
    return workouts.map((workout) => workout.toPrimitives());
  }
}
