import { DomainError } from "../../../../shared/domain/domain-error";

export class RoutineDoesNotExistError extends DomainError {
  readonly type = "RoutineDoesNotExistError";
  readonly message: string;

  constructor(public readonly routineId: string) {
    super();
    this.message = `The routine ${this.routineId} does not exist`;
  }
}
