import type { ContainerBuilder } from "diod";
import { RoutineRepository } from "../../../src/contexts/training/routines/domain/routine-repository";
import { DrizzleRoutineRepository } from "../../../src/contexts/training/routines/infrastructure/drizzle-routine-repository";

export function register(builder: ContainerBuilder) {
  builder.register(RoutineRepository).use(DrizzleRoutineRepository);
}
