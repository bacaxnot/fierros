import { InvalidArgumentError } from "../../../../shared/domain/domain-error";

const VALID_INVOLVEMENTS = ["primary", "secondary", "stabilizer"] as const;

type MuscleInvolvementValue = (typeof VALID_INVOLVEMENTS)[number];

export class MuscleInvolvement {
  public readonly value: MuscleInvolvementValue;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value as MuscleInvolvementValue;
  }

  private ensureIsValid(value: string): void {
    if (!VALID_INVOLVEMENTS.includes(value as MuscleInvolvementValue)) {
      throw new InvalidArgumentError(
        `Invalid muscle involvement: ${value}. Valid involvements: ${VALID_INVOLVEMENTS.join(", ")}`,
      );
    }
  }

  equals(other: MuscleInvolvement): boolean {
    return this.value === other.value;
  }
}
