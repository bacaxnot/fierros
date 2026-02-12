import { faker } from "@faker-js/faker";
import {
  Routine,
  type RoutinePrimitives,
} from "../../../../../src/contexts/training/routines/domain/routine";
import type { RoutineBlockPrimitives } from "../../../../../src/contexts/training/routines/domain/routine-block";
import { RoutineIdMother } from "./routine-id-mother";
import { TimestampMother } from "../../../../shared/domain/timestamp-mother";

export class RoutineMother {
  static create(params?: Partial<RoutinePrimitives>): Routine {
    const primitives: RoutinePrimitives = {
      id: RoutineIdMother.random().value,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      userId: faker.string.uuid(),
      blocks: [],
      createdAt: TimestampMother.random().value,
      updatedAt: TimestampMother.random().value,
      ...params,
    };
    return Routine.fromPrimitives(primitives);
  }

  static withBlocks(
    params?: Partial<RoutinePrimitives>,
  ): Routine {
    return RoutineMother.create({
      blocks: [RoutineMother.blockPrimitives()],
      ...params,
    });
  }

  static blockPrimitives(
    overrides?: Partial<RoutineBlockPrimitives>,
  ): RoutineBlockPrimitives {
    return {
      order: 1,
      notes: faker.lorem.sentence(),
      defaultRestTime: faker.number.int({ min: 30, max: 120 }),
      sets: [
        {
          order: 1,
          exerciseId: faker.string.uuid(),
          notes: null,
          restTime: null,
          metrics: [
            {
              metricId: faker.string.uuid(),
              targetRange: null,
              targetValue: { value: 10, unit: "quantity" },
              lastValue: null,
            },
          ],
        },
      ],
      ...overrides,
    };
  }
}
