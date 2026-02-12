import { AggregateRoot } from "../../../../shared/domain/aggregate-root";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { RoutineId } from "../../routines/domain/routine-id";
import { UserId } from "../../users/domain/user-id";
import { WorkoutBlock, type WorkoutBlockPrimitives } from "./workout-block";
import { WorkoutId } from "./workout-id";
import { WorkoutName } from "./workout-name";

export type WorkoutPrimitives = {
  id: string;
  userId: string;
  routineId: string | null;
  name: string;
  startedAt: string;
  finishedAt: string | null;
  notes: string | null;
  blocks: WorkoutBlockPrimitives[];
  createdAt: string;
  updatedAt: string;
};

export class Workout extends AggregateRoot {
  private constructor(
    private readonly id: WorkoutId,
    private readonly userId: UserId,
    private readonly routineId: RoutineId | null,
    private name: WorkoutName,
    private readonly startedAt: Date,
    private finishedAt: Date | null,
    private notes: string | null,
    private blocks: WorkoutBlock[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: {
    id: string;
    userId: string;
    routineId?: string | null;
    name: string;
    startedAt?: Date;
    notes?: string | null;
    blocks?: WorkoutBlockPrimitives[];
  }): Workout {
    const now = new Date();
    return new Workout(
      new WorkoutId(params.id),
      new UserId(params.userId),
      params.routineId ? new RoutineId(params.routineId) : null,
      new WorkoutName(params.name),
      params.startedAt ?? now,
      null,
      params.notes ?? null,
      (params.blocks ?? []).map(WorkoutBlock.fromPrimitives),
      now,
      now,
    );
  }

  static fromPrimitives(p: WorkoutPrimitives): Workout {
    return new Workout(
      new WorkoutId(p.id),
      new UserId(p.userId),
      p.routineId ? new RoutineId(p.routineId) : null,
      new WorkoutName(p.name),
      dateFromPrimitive(p.startedAt),
      p.finishedAt ? dateFromPrimitive(p.finishedAt) : null,
      p.notes,
      p.blocks.map(WorkoutBlock.fromPrimitives),
      dateFromPrimitive(p.createdAt),
      dateFromPrimitive(p.updatedAt),
    );
  }

  toPrimitives(): WorkoutPrimitives {
    return {
      id: this.id.value,
      userId: this.userId.value,
      routineId: this.routineId?.value ?? null,
      name: this.name.value,
      startedAt: dateToPrimitive(this.startedAt),
      finishedAt: this.finishedAt ? dateToPrimitive(this.finishedAt) : null,
      notes: this.notes,
      blocks: this.blocks.map((b) => b.toPrimitives()),
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }

  belongsTo(userId: string): boolean {
    return this.userId.value === userId;
  }

  isFinished(): boolean {
    return this.finishedAt !== null;
  }

  finish(): void {
    this.finishedAt = new Date();
    this.updatedAt = new Date();
  }
}
