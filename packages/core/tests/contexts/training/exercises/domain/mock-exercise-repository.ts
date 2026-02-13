import { mock } from "bun:test";
import type { Exercise } from "../../../../../src/contexts/training/exercises/domain/exercise";
import { ExerciseRepository } from "../../../../../src/contexts/training/exercises/domain/exercise-repository";

export class MockExerciseRepository extends ExerciseRepository {
  readonly save = mock((_exercise: Exercise): Promise<void> => Promise.resolve());
  readonly search = mock((): Promise<Exercise | null> => Promise.resolve(null));
  readonly searchByCriteria = mock((): Promise<Exercise[]> => Promise.resolve([]));
  readonly countByCriteria = mock((): Promise<number> => Promise.resolve(0));
  readonly delete = mock((): Promise<void> => Promise.resolve());

  returnOnSearchByCriteria(exercises: Exercise[]): void {
    this.searchByCriteria.mockResolvedValue(exercises);
  }
}
