import { mock } from "bun:test";
import type { Workout } from "../../../../../src/contexts/training/workouts/domain/workout";
import { WorkoutRepository } from "../../../../../src/contexts/training/workouts/domain/workout-repository";

export class MockWorkoutRepository extends WorkoutRepository {
  readonly save = mock((_workout: Workout): Promise<void> => Promise.resolve());
  readonly search = mock((): Promise<Workout | null> => Promise.resolve(null));
  readonly searchByCriteria = mock((): Promise<Workout[]> => Promise.resolve([]));
  readonly countByCriteria = mock((): Promise<number> => Promise.resolve(0));
  readonly delete = mock((): Promise<void> => Promise.resolve());

  returnOnSearch(workout: Workout | null): void {
    this.search.mockResolvedValue(workout);
  }

  returnOnSearchByCriteria(workouts: Workout[]): void {
    this.searchByCriteria.mockResolvedValue(workouts);
  }
}
