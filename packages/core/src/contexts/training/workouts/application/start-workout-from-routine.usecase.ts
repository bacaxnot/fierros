import { InferDependencies } from "../../../../../di/autoregister";
import { UnauthorizedResourceAccessError } from "../../../../shared/domain/unauthorized-resource-access-error";
import { Routine } from "../../routines/domain/routine";
import type { RoutineBlockPrimitives } from "../../routines/domain/routine-block";
import type { RoutineSetPrimitives } from "../../routines/domain/routine-set";
import type { RoutineSetMetricPrimitives } from "../../routines/domain/routine-set-metric";
import { FindRoutine } from "../../routines/domain/find-routine.usecase";
import { Workout } from "../domain/workout";
import type { WorkoutBlockPrimitives } from "../domain/workout-block";
import type { WorkoutSetPrimitives } from "../domain/workout-set";
import type { WorkoutSetMetricPrimitives } from "../domain/workout-set-metric";
import { WorkoutRepository } from "../domain/workout-repository";

@InferDependencies()
export class StartWorkoutFromRoutine {
  constructor(
    private readonly repository: WorkoutRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(params: {
    workoutId: string;
    userId: string;
    routineId: string;
  }): Promise<void> {
    const routine = await this.findRoutine.execute({ id: params.routineId });
    this.ensureRoutineBelongsToUser(routine, params.routineId, params.userId);

    const routinePrimitives = routine.toPrimitives();
    const blocks = this.copyRoutineBlocks(routinePrimitives.blocks);

    const workout = Workout.create({
      id: params.workoutId,
      userId: params.userId,
      routineId: params.routineId,
      name: routinePrimitives.name,
      blocks,
    });

    await this.repository.save(workout);
  }

  private copyRoutineBlocks(
    routineBlocks: RoutineBlockPrimitives[],
  ): WorkoutBlockPrimitives[] {
    return routineBlocks.map((block) => ({
      order: block.order,
      notes: block.notes,
      startedAt: null,
      finishedAt: null,
      sets: this.copyRoutineSets(block.sets, block.defaultRestTime),
    }));
  }

  private copyRoutineSets(
    routineSets: RoutineSetPrimitives[],
    defaultRestTime: number | null,
  ): WorkoutSetPrimitives[] {
    return routineSets.map((set) => ({
      order: set.order,
      exerciseId: set.exerciseId,
      notes: set.notes,
      startedAt: null,
      finishedAt: null,
      restTime: set.restTime ?? defaultRestTime,
      metrics: this.copyRoutineMetrics(set.metrics),
    }));
  }

  private copyRoutineMetrics(
    routineMetrics: RoutineSetMetricPrimitives[],
  ): WorkoutSetMetricPrimitives[] {
    return routineMetrics.map((metric) => ({
      metricId: metric.metricId,
      value: this.defaultMetricValue(metric),
      targetRange: metric.targetRange,
      targetValue: metric.targetValue,
    }));
  }

  private defaultMetricValue(
    metric: RoutineSetMetricPrimitives,
  ): { value: number; unit: string } {
    const unit =
      metric.targetValue?.unit ??
      metric.targetRange?.min?.unit ??
      metric.targetRange?.max?.unit ??
      "quantity";
    return { value: 0, unit };
  }

  private ensureRoutineBelongsToUser(
    routine: Routine,
    routineId: string,
    userId: string,
  ): void {
    if (routine.belongsTo(userId)) return;
    throw new UnauthorizedResourceAccessError(Routine, routineId);
  }
}
