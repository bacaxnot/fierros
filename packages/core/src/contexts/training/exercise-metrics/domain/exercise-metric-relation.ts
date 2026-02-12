import { InvalidArgumentError } from "../../../../shared/domain/domain-error";

const VALID_RELATIONS = ["direct", "inverse"] as const;

type ExerciseMetricRelationValue = (typeof VALID_RELATIONS)[number];

export class ExerciseMetricRelation {
  public readonly value: ExerciseMetricRelationValue;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value as ExerciseMetricRelationValue;
  }

  private ensureIsValid(value: string): void {
    if (!VALID_RELATIONS.includes(value as ExerciseMetricRelationValue)) {
      throw new InvalidArgumentError(
        `Invalid metric relation: ${value}. Valid relations: ${VALID_RELATIONS.join(", ")}`,
      );
    }
  }

  equals(other: ExerciseMetricRelation): boolean {
    return this.value === other.value;
  }
}
