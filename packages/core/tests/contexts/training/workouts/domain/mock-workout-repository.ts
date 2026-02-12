import { mock } from "bun:test";
import type { Workout } from "../../../../../src/contexts/training/workouts/domain/workout";
import { WorkoutRepository } from "../../../../../src/contexts/training/workouts/domain/workout-repository";

export class MockWorkoutRepository extends WorkoutRepository {
  readonly save = mock(() => Promise.resolve());
  readonly search = mock(() => Promise.resolve(null));
  readonly searchByUserId = mock(() => Promise.resolve([]));
  readonly delete = mock(() => Promise.resolve());

  returnOnSearch(workout: Workout | null): void {
    this.search.mockResolvedValue(workout);
  }

  returnOnSearchByUserId(workouts: Workout[]): void {
    this.searchByUserId.mockResolvedValue(workouts);
  }
}
