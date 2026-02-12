import { OrderBy } from "./order-by";
import { OrderType, OrderTypes } from "./order-type";

export class Order {
  constructor(
    public readonly orderBy: OrderBy,
    public readonly orderType: OrderType,
  ) {}

  static fromPrimitives(orderBy: string | null, orderType: string | null): Order {
    if (orderBy === null) {
      return Order.none();
    }
    return new Order(new OrderBy(orderBy), OrderType.fromValue(orderType));
  }

  static none(): Order {
    return new Order(new OrderBy(""), new OrderType(OrderTypes.NONE));
  }

  static asc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.ASC));
  }

  static desc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypes.DESC));
  }

  hasOrder(): boolean {
    return !this.orderType.isNone();
  }
}
