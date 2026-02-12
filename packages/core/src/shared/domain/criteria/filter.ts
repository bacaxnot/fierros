import { FilterField } from "./filter-field";
import { FilterOperator, type Operator } from "./filter-operator";
import { FilterValue, type FilterValueType } from "./filter-value";

export type FilterPrimitives = {
  field: string;
  operator: string;
  value: FilterValueType;
};

export class Filter {
  constructor(
    public readonly field: FilterField,
    public readonly operator: FilterOperator,
    public readonly value: FilterValue,
  ) {}

  static fromPrimitives(
    field: string,
    operator: string,
    value: FilterValueType,
  ): Filter {
    return new Filter(
      new FilterField(field),
      FilterOperator.fromValue(operator),
      new FilterValue(value),
    );
  }

  static create(
    field: string,
    operator: Operator,
    value: FilterValueType,
  ): Filter {
    return new Filter(
      new FilterField(field),
      new FilterOperator(operator),
      new FilterValue(value),
    );
  }

  toPrimitives(): FilterPrimitives {
    return {
      field: this.field.value,
      operator: this.operator.value,
      value: this.value.value,
    };
  }
}
