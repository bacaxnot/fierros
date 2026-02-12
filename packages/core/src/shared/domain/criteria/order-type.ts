import { InvalidArgumentError } from "../domain-error";

export enum OrderTypes {
  ASC = "ASC",
  DESC = "DESC",
  NONE = "NONE",
}

export class OrderType {
  private static validTypes = Object.values(OrderTypes);

  constructor(public readonly value: OrderTypes) {}

  static fromValue(value: string | null): OrderType {
    if (value === null) return new OrderType(OrderTypes.NONE);

    const type = this.validTypes.find((t) => t === value.toUpperCase());
    if (!type) {
      throw new InvalidArgumentError(`Invalid order type: ${value}`);
    }
    return new OrderType(type);
  }

  isNone(): boolean {
    return this.value === OrderTypes.NONE;
  }
}
