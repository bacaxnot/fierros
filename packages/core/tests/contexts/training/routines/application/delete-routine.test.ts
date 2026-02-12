import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { DeleteRoutine } from "../../../../../src/contexts/training/routines/application/delete-routine.usecase";
import { FindRoutine } from "../../../../../src/contexts/training/routines/domain/find-routine.usecase";
import { RoutineDoesNotExistError } from "../../../../../src/contexts/training/routines/domain/routine-does-not-exist-error";
import { UnauthorizedResourceAccessError } from "../../../../../src/shared/domain/unauthorized-resource-access-error";
import { MockRoutineRepository } from "../domain/mock-routine-repository";
import { RoutineIdMother } from "../domain/routine-id-mother";
import { RoutineMother } from "../domain/routine-mother";

describe("DeleteRoutine", () => {
  const userId = faker.string.uuid();

  let repository: MockRoutineRepository;
  let findRoutine: FindRoutine;
  let usecase: DeleteRoutine;

  beforeEach(() => {
    repository = new MockRoutineRepository();
    findRoutine = new FindRoutine(repository);
    usecase = new DeleteRoutine(repository, findRoutine);
  });

  it("finds routine, verifies ownership, and deletes", async () => {
    const routine = RoutineMother.create({ userId });
    const routineId = routine.toPrimitives().id;
    repository.returnOnSearch(routine);

    await usecase.execute({ userId, routineId });

    expect(repository.delete).toHaveBeenCalledTimes(1);
  });

  it("rejects if routine does not exist", async () => {
    const routineId = RoutineIdMother.random().value;
    repository.returnOnSearch(null);

    await expect(usecase.execute({ userId, routineId })).rejects.toThrow(
      RoutineDoesNotExistError,
    );
  });

  it("rejects if routine does not belong to user", async () => {
    const otherUserId = faker.string.uuid();
    const routine = RoutineMother.create({ userId: otherUserId });
    const routineId = routine.toPrimitives().id;
    repository.returnOnSearch(routine);

    await expect(usecase.execute({ userId, routineId })).rejects.toThrow(
      UnauthorizedResourceAccessError,
    );
  });
});
