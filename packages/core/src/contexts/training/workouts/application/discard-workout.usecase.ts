import { InferDependencies } from "../../../../../di/autoregister";
import { UnauthorizedResourceAccessError } from "../../../../shared/domain/unauthorized-resource-access-error";
import { Workout } from "../domain/workout";
import { WorkoutAlreadyFinishedError } from "../domain/workout-already-finished-error";
import { WorkoutId } from "../domain/workout-id";
import { WorkoutRepository } from "../domain/workout-repository";
import { FindWorkout } from "../domain/find-workout.usecase";

@InferDependencies()
export class DiscardWorkout {
  constructor(
    private readonly repository: WorkoutRepository,
    private readonly findWorkout: FindWorkout,
  ) {}

  async execute(params: { userId: string; workoutId: string }): Promise<void> {
    const workout = await this.findWorkout.execute({ id: params.workoutId });
    this.ensureWorkoutBelongsToUser(workout, params.workoutId, params.userId);
    this.ensureWorkoutIsNotFinished(workout, params.workoutId);
    await this.repository.delete(new WorkoutId(params.workoutId));
  }

  private ensureWorkoutBelongsToUser(
    workout: Workout,
    workoutId: string,
    userId: string,
  ): void {
    if (workout.belongsTo(userId)) return;
    throw new UnauthorizedResourceAccessError(Workout, workoutId);
  }

  private ensureWorkoutIsNotFinished(
    workout: Workout,
    workoutId: string,
  ): void {
    if (!workout.isFinished()) return;
    throw new WorkoutAlreadyFinishedError(workoutId);
  }
}
