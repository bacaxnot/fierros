import { describe, it, expect, beforeEach } from "bun:test";
import { CreateRoutine } from "../../../../../src/contexts/training/routines/application/create-routine.usecase";
import { Routine } from "../../../../../src/contexts/training/routines/domain/routine";
import { RoutineMother } from "../domain/routine-mother";
import { RoutineIdMother } from "../domain/routine-id-mother";
import { MockRoutineRepository } from "../domain/mock-routine-repository";
import { faker } from "@faker-js/faker";

describe("CreateRoutine", () => {
  const userId = faker.string.uuid();

  let repository: MockRoutineRepository;
  let usecase: CreateRoutine;

  beforeEach(() => {
    repository = new MockRoutineRepository();
    usecase = new CreateRoutine(repository);
  });

  it("creates routine with blocks and sets and persists it", async () => {
    const id = RoutineIdMother.random().value;
    const blocks = [RoutineMother.blockPrimitives()];

    await usecase.execute({
      id,
      userId,
      name: "Push Pull Legs",
      description: "A PPL routine",
      blocks,
    });

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedRoutine = (repository.save as ReturnType<typeof import("bun:test").mock>).mock.calls[0][0] as Routine;
    const primitives = savedRoutine.toPrimitives();
    expect(primitives.id).toBe(id);
    expect(primitives.name).toBe("Push Pull Legs");
    expect(primitives.description).toBe("A PPL routine");
    expect(primitives.userId).toBe(userId);
    expect(primitives.blocks).toEqual(blocks);
  });

  it("creates routine with empty blocks", async () => {
    const id = RoutineIdMother.random().value;

    await usecase.execute({
      id,
      userId,
      name: "Empty Routine",
      description: null,
      blocks: [],
    });

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedRoutine = (repository.save as ReturnType<typeof import("bun:test").mock>).mock.calls[0][0] as Routine;
    const primitives = savedRoutine.toPrimitives();
    expect(primitives.blocks).toEqual([]);
    expect(primitives.description).toBeNull();
  });
});
