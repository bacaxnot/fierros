import { DomainError } from "./domain-error";

type Constructor = { name: string };

export class UnauthorizedResourceAccessError extends DomainError {
  readonly type = "UnauthorizedResourceAccessError";
  readonly message: string;

  constructor(
    public readonly resourceType: Constructor,
    public readonly resourceId: string,
  ) {
    super();
    this.message = `Unauthorized access to ${this.resourceType.name} ${this.resourceId}`;
  }
}
