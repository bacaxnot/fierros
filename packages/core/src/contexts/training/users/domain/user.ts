import { AggregateRoot } from "../../../../shared/domain/aggregate-root";
import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { UserId } from "./user-id";
import { UserName } from "./user-name";

export type UserPrimitives = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export class User extends AggregateRoot {
  private constructor(
    private readonly id: UserId,
    private name: UserName,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    super();
  }

  static create(params: { id: string; name: string }): User {
    const now = new Date();
    return new User(
      new UserId(params.id),
      new UserName(params.name),
      now,
      now,
    );
  }

  static fromPrimitives(p: UserPrimitives): User {
    return new User(
      new UserId(p.id),
      new UserName(p.name),
      dateFromPrimitive(p.createdAt),
      dateFromPrimitive(p.updatedAt),
    );
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      createdAt: dateToPrimitive(this.createdAt),
      updatedAt: dateToPrimitive(this.updatedAt),
    };
  }
}
