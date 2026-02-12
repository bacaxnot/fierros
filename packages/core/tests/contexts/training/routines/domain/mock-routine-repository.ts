import { mock } from "bun:test";
import type { Routine } from "../../../../../src/contexts/training/routines/domain/routine";
import { RoutineRepository } from "../../../../../src/contexts/training/routines/domain/routine-repository";

export class MockRoutineRepository extends RoutineRepository {
  readonly save = mock(() => {});
  readonly search = mock(() => {});
  readonly searchByUserId = mock(() => {});
  readonly delete = mock(() => {});

  returnOnSearch(routine: Routine | null): void {
    this.search.mockResolvedValue(routine);
  }

  returnOnSearchByUserId(routines: Routine[]): void {
    this.searchByUserId.mockResolvedValue(routines);
  }
}
