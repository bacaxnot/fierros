import { AggregateRoot } from "../../../../shared/domain/aggregate-root";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { ExerciseMetricId } from "../../exercise-metrics/domain/exercise-metric-id";
import { UserId } from "../../users/domain/user-id";
import { ExerciseDescription } from "./exercise-description";
import { ExerciseId } from "./exercise-id";
import { ExerciseName } from "./exercise-name";
import {
  ExerciseTargetMuscle,
  type ExerciseTargetMusclePrimitives,
} from "./exercise-target-muscle";

export type ExercisePrimitives = {
  id: string;
  name: string;
  description: string | null;
  userId: string | null;
  targetMuscles: ExerciseTargetMusclePrimitives[];
  defaultMetrics: string[];
  createdAt: string;
  updatedAt: string;
};

export class Exercise extends AggregateRoot {
  private constructor(
    private readonly id: ExerciseId,
    private name: ExerciseName,
    private description: ExerciseDescription | null,
    private readonly userId: UserId | null,
    private targetMuscles: ExerciseTargetMuscle[],
    private defaultMetrics: ExerciseMetricId[],
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: {
    id: string;
    name: string;
    description?: string | null;
    userId?: string | null;
    targetMuscles?: ExerciseTargetMusclePrimitives[];
    defaultMetrics?: string[];
  }): Exercise {
    const now = new Date();
    return new Exercise(
      new ExerciseId(params.id),
      new ExerciseName(params.name),
      params.description ? new ExerciseDescription(params.description) : null,
      params.userId ? new UserId(params.userId) : null,
      (params.targetMuscles ?? []).map(ExerciseTargetMuscle.fromPrimitives),
      (params.defaultMetrics ?? []).map((id) => new ExerciseMetricId(id)),
      now,
      now,
    );
  }

  static fromPrimitives(p: ExercisePrimitives): Exercise {
    return new Exercise(
      new ExerciseId(p.id),
      new ExerciseName(p.name),
      p.description ? new ExerciseDescription(p.description) : null,
      p.userId ? new UserId(p.userId) : null,
      p.targetMuscles.map(ExerciseTargetMuscle.fromPrimitives),
      p.defaultMetrics.map((id) => new ExerciseMetricId(id)),
      dateFromPrimitive(p.createdAt),
      dateFromPrimitive(p.updatedAt),
    );
  }

  toPrimitives(): ExercisePrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description?.value ?? null,
      userId: this.userId?.value ?? null,
      targetMuscles: this.targetMuscles.map((tm) => tm.toPrimitives()),
      defaultMetrics: this.defaultMetrics.map((m) => m.value),
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
