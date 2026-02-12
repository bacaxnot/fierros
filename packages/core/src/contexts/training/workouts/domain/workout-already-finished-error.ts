import { DomainError } from "../../../../shared/domain/domain-error";

export class WorkoutAlreadyFinishedError extends DomainError {
  readonly type = "WorkoutAlreadyFinishedError";
  readonly message: string;

  constructor(public readonly workoutId: string) {
    super();
    this.message = `The workout ${this.workoutId} is already finished`;
  }
}
