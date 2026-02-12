import { InvalidArgumentError } from "../domain-error";

export enum Operator {
  EQUAL = "eq",
  NOT_EQUAL = "ne",
  GT = "gt",
  LT = "lt",
  GTE = "gte",
  LTE = "lte",
  CONTAINS = "contains",
  NOT_CONTAINS = "notContains",
  IN = "in",
  NOT_IN = "notIn",
  IS_NULL = "isNull",
  IS_NOT_NULL = "isNotNull",
}

export class FilterOperator {
  private static validOperators = Object.values(Operator);

  constructor(public readonly value: Operator) {
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: string): void {
    if (!FilterOperator.validOperators.includes(value as Operator)) {
      throw new InvalidArgumentError(
        `Invalid filter operator: ${value}. Valid operators: ${FilterOperator.validOperators.join(", ")}`,
      );
    }
  }

  static fromValue(value: string): FilterOperator {
    const operator = FilterOperator.validOperators.find(
      (op) => op === value || op.valueOf() === value,
    );
    if (!operator) {
      throw new InvalidArgumentError(`Invalid filter operator: ${value}`);
    }
    return new FilterOperator(operator);
  }

  isNullCheck(): boolean {
    return [Operator.IS_NULL, Operator.IS_NOT_NULL].includes(this.value);
  }

  isArrayOperator(): boolean {
    return [Operator.IN, Operator.NOT_IN].includes(this.value);
  }
}
