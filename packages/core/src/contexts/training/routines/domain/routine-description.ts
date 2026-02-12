import { InvalidArgumentError } from "../../../../shared/domain/domain-error";

const MAX_DESCRIPTION_LENGTH = 1000;

export class RoutineDescription {
  public readonly value: string;

  constructor(value: string) {
    this.ensureHasValidLength(value);
    this.value = value.trim();
  }

  private ensureHasValidLength(value: string): void {
    if (value.trim().length <= MAX_DESCRIPTION_LENGTH) return;
    throw new InvalidArgumentError(
      `Routine description is too long (max ${MAX_DESCRIPTION_LENGTH} characters)`,
    );
  }

  equals(other: RoutineDescription): boolean {
    return this.value === other.value;
  }
}
