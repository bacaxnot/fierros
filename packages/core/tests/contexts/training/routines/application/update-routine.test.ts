import { describe, it, expect, beforeEach } from "bun:test";
import { UpdateRoutine } from "../../../../../src/contexts/training/routines/application/update-routine.usecase";
import { FindRoutine } from "../../../../../src/contexts/training/routines/domain/find-routine.usecase";
import { RoutineDoesNotExistError } from "../../../../../src/contexts/training/routines/domain/routine-does-not-exist-error";
import { UnauthorizedResourceAccessError } from "../../../../../src/shared/domain/unauthorized-resource-access-error";
import { RoutineMother } from "../domain/routine-mother";
import { RoutineIdMother } from "../domain/routine-id-mother";
import { MockRoutineRepository } from "../domain/mock-routine-repository";
import { faker } from "@faker-js/faker";

describe("UpdateRoutine", () => {
  const userId = faker.string.uuid();

  let repository: MockRoutineRepository;
  let findRoutine: FindRoutine;
  let usecase: UpdateRoutine;

  beforeEach(() => {
    repository = new MockRoutineRepository();
    findRoutine = new FindRoutine(repository);
    usecase = new UpdateRoutine(repository, findRoutine);
  });

  it("updates routine name only", async () => {
    const routine = RoutineMother.create({ userId });
    const routineId = routine.toPrimitives().id;
    repository.returnOnSearch(routine);

    await usecase.execute(
      { userId, routineId },
      { name: "New Name" },
    );

    expect(repository.save).toHaveBeenCalledTimes(1);
    const saved = (repository.save as ReturnType<typeof import("bun:test").mock>).mock.calls[0][0];
    expect(saved.toPrimitives().name).toBe("New Name");
  });

  it("updates routine blocks only", async () => {
    const routine = RoutineMother.create({ userId });
    const routineId = routine.toPrimitives().id;
    repository.returnOnSearch(routine);
    const newBlocks = [RoutineMother.blockPrimitives()];

    await usecase.execute(
      { userId, routineId },
      { blocks: newBlocks },
    );

    expect(repository.save).toHaveBeenCalledTimes(1);
    const saved = (repository.save as ReturnType<typeof import("bun:test").mock>).mock.calls[0][0];
    expect(saved.toPrimitives().blocks).toEqual(newBlocks);
  });

  it("updates all fields", async () => {
    const routine = RoutineMother.create({ userId });
    const routineId = routine.toPrimitives().id;
    repository.returnOnSearch(routine);
    const newBlocks = [RoutineMother.blockPrimitives()];

    await usecase.execute(
      { userId, routineId },
      { name: "Updated", description: "New desc", blocks: newBlocks },
    );

    expect(repository.save).toHaveBeenCalledTimes(1);
    const saved = (repository.save as ReturnType<typeof import("bun:test").mock>).mock.calls[0][0];
    const primitives = saved.toPrimitives();
    expect(primitives.name).toBe("Updated");
    expect(primitives.description).toBe("New desc");
    expect(primitives.blocks).toEqual(newBlocks);
  });

  it("rejects if routine does not exist", async () => {
    const routineId = RoutineIdMother.random().value;
    repository.returnOnSearch(null);

    await expect(
      usecase.execute({ userId, routineId }, { name: "New Name" }),
    ).rejects.toThrow(RoutineDoesNotExistError);
  });

  it("rejects if routine does not belong to user", async () => {
    const otherUserId = faker.string.uuid();
    const routine = RoutineMother.create({ userId: otherUserId });
    const routineId = routine.toPrimitives().id;
    repository.returnOnSearch(routine);

    await expect(
      usecase.execute({ userId, routineId }, { name: "New Name" }),
    ).rejects.toThrow(UnauthorizedResourceAccessError);
  });
});
