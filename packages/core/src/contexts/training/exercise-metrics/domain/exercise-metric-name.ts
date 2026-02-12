import { InvalidArgumentError } from "../../../../shared/domain/domain-error";

const MAX_NAME_LENGTH = 100;

export class ExerciseMetricName {
  public readonly value: string;

  constructor(value: string) {
    this.ensureIsNotEmpty(value);
    this.ensureHasValidLength(value);
    this.value = value.trim();
  }

  private ensureIsNotEmpty(value: string): void {
    if (value && value.trim() !== "") return;
    throw new InvalidArgumentError("Exercise metric name cannot be empty");
  }

  private ensureHasValidLength(value: string): void {
    if (value.trim().length <= MAX_NAME_LENGTH) return;
    throw new InvalidArgumentError(
      `Exercise metric name is too long (max ${MAX_NAME_LENGTH} characters)`,
    );
  }

  equals(other: ExerciseMetricName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
