import { DomainError } from "../../../../shared/domain/domain-error";

export class WorkoutDoesNotExistError extends DomainError {
  readonly type = "WorkoutDoesNotExistError";
  readonly message: string;

  constructor(public readonly workoutId: string) {
    super();
    this.message = `The workout ${this.workoutId} does not exist`;
  }
}
