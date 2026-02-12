import { InferDependencies } from "../../../../../di/autoregister";
import type { Workout } from "./workout";
import { WorkoutDoesNotExistError } from "./workout-does-not-exist-error";
import { WorkoutId } from "./workout-id";
import { WorkoutRepository } from "./workout-repository";

@InferDependencies()
export class FindWorkout {
  constructor(private readonly repository: WorkoutRepository) {}

  async execute(params: { id: string }): Promise<Workout> {
    const workoutId = new WorkoutId(params.id);
    const workout = await this.repository.search(workoutId);
    if (!workout) throw new WorkoutDoesNotExistError(params.id);
    return workout;
  }
}
