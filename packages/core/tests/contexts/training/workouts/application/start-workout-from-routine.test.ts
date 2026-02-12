import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { StartWorkoutFromRoutine } from "../../../../../src/contexts/training/workouts/application/start-workout-from-routine.usecase";
import { FindRoutine } from "../../../../../src/contexts/training/routines/domain/find-routine.usecase";
import { RoutineDoesNotExistError } from "../../../../../src/contexts/training/routines/domain/routine-does-not-exist-error";
import { UnauthorizedResourceAccessError } from "../../../../../src/shared/domain/unauthorized-resource-access-error";
import { RoutineMother } from "../../routines/domain/routine-mother";
import { MockRoutineRepository } from "../../routines/domain/mock-routine-repository";
import { MockWorkoutRepository } from "../domain/mock-workout-repository";
import { WorkoutIdMother } from "../domain/workout-id-mother";
import type { RoutineBlockPrimitives } from "../../../../../src/contexts/training/routines/domain/routine-block";

describe("StartWorkoutFromRoutine", () => {
  const userId = faker.string.uuid();
  const otherUserId = faker.string.uuid();

  let workoutRepository: MockWorkoutRepository;
  let routineRepository: MockRoutineRepository;
  let findRoutine: FindRoutine;
  let usecase: StartWorkoutFromRoutine;

  beforeEach(() => {
    workoutRepository = new MockWorkoutRepository();
    routineRepository = new MockRoutineRepository();
    findRoutine = new FindRoutine(routineRepository);
    usecase = new StartWorkoutFromRoutine(workoutRepository, findRoutine);
  });

  it("copies routine structure into a new workout and persists it", async () => {
    const exerciseId1 = faker.string.uuid();
    const exerciseId2 = faker.string.uuid();
    const metricId1 = faker.string.uuid();
    const routineBlocks: RoutineBlockPrimitives[] = [
      {
        order: 1,
        notes: "Warm-up block",
        defaultRestTime: 60,
        sets: [
          {
            order: 1,
            exerciseId: exerciseId1,
            notes: "Go slow",
            restTime: null,
            metrics: [
              {
                metricId: metricId1,
                targetRange: { min: { value: 8, unit: "quantity" }, max: { value: 12, unit: "quantity" } },
                targetValue: null,
                lastValue: { value: 10, unit: "quantity" },
              },
            ],
          },
          {
            order: 2,
            exerciseId: exerciseId2,
            notes: null,
            restTime: null,
            metrics: [],
          },
        ],
      },
    ];
    const routine = RoutineMother.create({
      userId,
      blocks: routineBlocks,
    });
    const routinePrimitives = routine.toPrimitives();
    routineRepository.returnOnSearch(routine);

    const workoutId = WorkoutIdMother.random().value;

    await usecase.execute({
      workoutId,
      userId,
      routineId: routinePrimitives.id,
    });

    expect(workoutRepository.save).toHaveBeenCalledTimes(1);
    const savedWorkout = workoutRepository.save.mock.calls[0][0];
    const savedPrimitives = savedWorkout.toPrimitives();

    expect(savedPrimitives.id).toBe(workoutId);
    expect(savedPrimitives.userId).toBe(userId);
    expect(savedPrimitives.routineId).toBe(routinePrimitives.id);
    expect(savedPrimitives.name).toBe(routinePrimitives.name);
    expect(savedPrimitives.finishedAt).toBeNull();
    expect(savedPrimitives.blocks).toHaveLength(1);

    const block = savedPrimitives.blocks[0];
    expect(block.order).toBe(1);
    expect(block.notes).toBe("Warm-up block");
    expect(block.startedAt).toBeNull();
    expect(block.finishedAt).toBeNull();
    expect(block.sets).toHaveLength(2);

    const set1 = block.sets[0];
    expect(set1.order).toBe(1);
    expect(set1.exerciseId).toBe(exerciseId1);
    expect(set1.notes).toBe("Go slow");
    expect(set1.restTime).toBe(60);
    expect(set1.startedAt).toBeNull();
    expect(set1.finishedAt).toBeNull();
    expect(set1.metrics).toHaveLength(1);
    expect(set1.metrics[0].metricId).toBe(metricId1);
    expect(set1.metrics[0].value).toEqual({ value: 0, unit: "quantity" });
    expect(set1.metrics[0].targetRange).toEqual({
      min: { value: 8, unit: "quantity" },
      max: { value: 12, unit: "quantity" },
    });
    expect(set1.metrics[0].targetValue).toBeNull();

    const set2 = block.sets[1];
    expect(set2.restTime).toBe(60);
    expect(set2.metrics).toHaveLength(0);
  });

  it("uses set-level rest time when it overrides block default", async () => {
    const routineBlocks: RoutineBlockPrimitives[] = [
      {
        order: 1,
        notes: null,
        defaultRestTime: 60,
        sets: [
          {
            order: 1,
            exerciseId: faker.string.uuid(),
            notes: null,
            restTime: 90,
            metrics: [],
          },
        ],
      },
    ];
    const routine = RoutineMother.create({
      userId,
      blocks: routineBlocks,
    });
    routineRepository.returnOnSearch(routine);

    const workoutId = WorkoutIdMother.random().value;

    await usecase.execute({
      workoutId,
      userId,
      routineId: routine.toPrimitives().id,
    });

    const savedWorkout = workoutRepository.save.mock.calls[0][0];
    const savedPrimitives = savedWorkout.toPrimitives();
    expect(savedPrimitives.blocks[0].sets[0].restTime).toBe(90);
  });

  it("throws RoutineDoesNotExistError when routine does not exist", async () => {
    routineRepository.returnOnSearch(null);

    await expect(
      usecase.execute({
        workoutId: WorkoutIdMother.random().value,
        userId,
        routineId: WorkoutIdMother.random().value,
      }),
    ).rejects.toThrow(RoutineDoesNotExistError);
  });

  it("throws UnauthorizedResourceAccessError when routine does not belong to user", async () => {
    const routine = RoutineMother.create({ userId: otherUserId });
    routineRepository.returnOnSearch(routine);

    await expect(
      usecase.execute({
        workoutId: WorkoutIdMother.random().value,
        userId,
        routineId: routine.toPrimitives().id,
      }),
    ).rejects.toThrow(UnauthorizedResourceAccessError);
  });
});
