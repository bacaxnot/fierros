import { InvalidArgumentError } from "../../../../shared/domain/domain-error";

const VALID_MUSCLE_GROUPS = [
  "chest",
  "upper_back",
  "lats",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "core",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "hip_flexors",
  "adductors",
  "abductors",
] as const;

type MuscleGroupValue = (typeof VALID_MUSCLE_GROUPS)[number];

export class MuscleGroup {
  public readonly value: MuscleGroupValue;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value as MuscleGroupValue;
  }

  private ensureIsValid(value: string): void {
    if (!VALID_MUSCLE_GROUPS.includes(value as MuscleGroupValue)) {
      throw new InvalidArgumentError(
        `Invalid muscle group: ${value}. Valid groups: ${VALID_MUSCLE_GROUPS.join(", ")}`,
      );
    }
  }

  equals(other: MuscleGroup): boolean {
    return this.value === other.value;
  }
}
