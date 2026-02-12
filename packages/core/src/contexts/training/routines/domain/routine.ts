import { AggregateRoot } from "../../../../shared/domain/aggregate-root";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { UserId } from "../../users/domain/user-id";
import { RoutineBlock, type RoutineBlockPrimitives } from "./routine-block";
import { RoutineDescription } from "./routine-description";
import { RoutineId } from "./routine-id";
import { RoutineName } from "./routine-name";

export type RoutinePrimitives = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  blocks: RoutineBlockPrimitives[];
  createdAt: string;
  updatedAt: string;
};

export class Routine extends AggregateRoot {
  private constructor(
    private readonly id: RoutineId,
    private name: RoutineName,
    private description: RoutineDescription | null,
    private readonly userId: UserId,
    private blocks: RoutineBlock[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: {
    id: string;
    name: string;
    description?: string | null;
    userId: string;
    blocks?: RoutineBlockPrimitives[];
  }): Routine {
    const now = new Date();
    return new Routine(
      new RoutineId(params.id),
      new RoutineName(params.name),
      params.description ? new RoutineDescription(params.description) : null,
      new UserId(params.userId),
      (params.blocks ?? []).map(RoutineBlock.fromPrimitives),
      now,
      now,
    );
  }

  static fromPrimitives(p: RoutinePrimitives): Routine {
    return new Routine(
      new RoutineId(p.id),
      new RoutineName(p.name),
      p.description ? new RoutineDescription(p.description) : null,
      new UserId(p.userId),
      p.blocks.map(RoutineBlock.fromPrimitives),
      dateFromPrimitive(p.createdAt),
      dateFromPrimitive(p.updatedAt),
    );
  }

  toPrimitives(): RoutinePrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description?.value ?? null,
      userId: this.userId.value,
      blocks: this.blocks.map((b) => b.toPrimitives()),
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
