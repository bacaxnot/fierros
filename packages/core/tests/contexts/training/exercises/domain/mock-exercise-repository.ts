import { mock } from "bun:test";
import type { Exercise } from "../../../../../src/contexts/training/exercises/domain/exercise";
import { ExerciseRepository } from "../../../../../src/contexts/training/exercises/domain/exercise-repository";

export class MockExerciseRepository extends ExerciseRepository {
  readonly save = mock(() => {});
  readonly search = mock(() => {});
  readonly searchByUserId = mock(() => {});
  readonly delete = mock(() => {});

  returnOnSearchByUserId(exercises: Exercise[]): void {
    this.searchByUserId.mockResolvedValue(exercises);
  }
}
