import { generateUuid, validateUuid } from "../../utils";
import { InvalidArgumentError } from "./domain-error";

export class Id {
  public readonly value: string;

  constructor(value?: string) {
    if (value === undefined) {
      this.value = this.generate();
    } else {
      this.ensureIsValidUuid(value);
      this.value = value;
    }
  }

  private generate(): string {
    return generateUuid();
  }

  private ensureIsValidUuid(value: string): void {
    if (validateUuid(value)) return;
    throw new InvalidArgumentError("Invalid UUID format");
  }

  equals(other: Id): boolean {
    return this.value === other.value;
  }
}
