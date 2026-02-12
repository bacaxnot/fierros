import { mock } from "bun:test";
import type { Routine } from "../../../../../src/contexts/training/routines/domain/routine";
import { RoutineRepository } from "../../../../../src/contexts/training/routines/domain/routine-repository";

export class MockRoutineRepository extends RoutineRepository {
  readonly save = mock((_routine: Routine): Promise<void> => Promise.resolve());
  readonly search = mock((): Promise<Routine | null> => Promise.resolve(null));
  readonly searchByUserId = mock((): Promise<Routine[]> => Promise.resolve([]));
  readonly delete = mock((): Promise<void> => Promise.resolve());

  returnOnSearch(routine: Routine | null): void {
    this.search.mockResolvedValue(routine);
  }

  returnOnSearchByUserId(routines: Routine[]): void {
    this.searchByUserId.mockResolvedValue(routines);
  }
}
