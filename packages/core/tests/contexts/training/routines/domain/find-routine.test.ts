import { describe, it, expect, beforeEach } from "bun:test";
import { FindRoutine } from "../../../../../src/contexts/training/routines/domain/find-routine.usecase";
import { RoutineDoesNotExistError } from "../../../../../src/contexts/training/routines/domain/routine-does-not-exist-error";
import { RoutineMother } from "./routine-mother";
import { RoutineIdMother } from "./routine-id-mother";
import { MockRoutineRepository } from "./mock-routine-repository";

describe("FindRoutine", () => {
  let repository: MockRoutineRepository;
  let usecase: FindRoutine;

  beforeEach(() => {
    repository = new MockRoutineRepository();
    usecase = new FindRoutine(repository);
  });

  it("finds and returns the routine", async () => {
    const routine = RoutineMother.create();
    const primitives = routine.toPrimitives();
    repository.returnOnSearch(routine);

    const result = await usecase.execute({ id: primitives.id });

    expect(result.toPrimitives()).toEqual(primitives);
  });

  it("rejects if routine does not exist", async () => {
    const id = RoutineIdMother.random().value;
    repository.returnOnSearch(null);

    await expect(usecase.execute({ id })).rejects.toThrow(
      RoutineDoesNotExistError,
    );
  });
});
