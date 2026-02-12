import { describe, it, expect, beforeEach } from "bun:test";
import { SearchRoutinesByUser } from "../../../../../src/contexts/training/routines/application/search-routines-by-user.usecase";
import { RoutineMother } from "../domain/routine-mother";
import { MockRoutineRepository } from "../domain/mock-routine-repository";
import { faker } from "@faker-js/faker";

describe("SearchRoutinesByUser", () => {
  const userId = faker.string.uuid();

  let repository: MockRoutineRepository;
  let usecase: SearchRoutinesByUser;

  beforeEach(() => {
    repository = new MockRoutineRepository();
    usecase = new SearchRoutinesByUser(repository);
  });

  it("returns all routines for the user as primitives", async () => {
    const routines = [
      RoutineMother.create({ userId }),
      RoutineMother.create({ userId }),
    ];
    repository.returnOnSearchByUserId(routines);

    const result = await usecase.execute({ userId });

    expect(result).toEqual(routines.map((r) => r.toPrimitives()));
  });

  it("returns empty list when user has no routines", async () => {
    repository.returnOnSearchByUserId([]);

    const result = await usecase.execute({ userId });

    expect(result).toEqual([]);
  });
});
