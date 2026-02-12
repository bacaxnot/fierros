import { Id } from "../../../src/shared/domain/id";

export class IdMother {
  static random(): Id {
    return new Id();
  }
}
