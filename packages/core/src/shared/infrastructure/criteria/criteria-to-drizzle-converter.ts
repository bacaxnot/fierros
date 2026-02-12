import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  notInArray,
  notLike,
  type SQL,
} from "@repo/db/orm";
import type { Criteria } from "../../domain/criteria/criteria";
import type { Filter } from "../../domain/criteria/filter";
import { Operator } from "../../domain/criteria/filter-operator";
import { OrderTypes } from "../../domain/criteria/order-type";
import { InvalidArgumentError } from "../../domain/domain-error";

export type FieldMapping = Record<string, string>;

export type DrizzleQueryConfig = {
  where?: SQL;
  orderBy?: SQL;
  limit?: number;
  offset?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DrizzleTable = Record<string, any>;

export class CriteriaToDrizzleConverter<T extends DrizzleTable> {
  constructor(
    private readonly table: T,
    private readonly fieldMapping: FieldMapping = {},
  ) {}

  convert(criteria: Criteria): DrizzleQueryConfig {
    const config: DrizzleQueryConfig = {};

    if (criteria.hasFilters()) {
      const conditions = criteria.filters.value.map((filter) =>
        this.convertFilter(filter),
      );
      config.where =
        conditions.length === 1 ? conditions[0] : and(...conditions);
    }

    if (criteria.hasOrder()) {
      const columnName = this.mapField(criteria.order.orderBy.value);
      const column = this.getColumn(columnName);

      config.orderBy =
        criteria.order.orderType.value === OrderTypes.ASC
          ? asc(column)
          : desc(column);
    }

    if (criteria.hasPagination()) {
      if (criteria.pagination.limit !== null) {
        config.limit = criteria.pagination.limit;
      }
      if (criteria.pagination.offset !== null) {
        config.offset = criteria.pagination.offset;
      }
    }

    return config;
  }

  private convertFilter(filter: Filter): SQL {
    const columnName = this.mapField(filter.field.value);
    const column = this.getColumn(columnName);
    const value = filter.value.value;

    switch (filter.operator.value) {
      case Operator.EQUAL:
        return eq(column, value as string | number | boolean);

      case Operator.NOT_EQUAL:
        return ne(column, value as string | number | boolean);

      case Operator.GT:
        return gt(column, value as string | number);

      case Operator.LT:
        return lt(column, value as string | number);

      case Operator.GTE:
        return gte(column, value as string | number);

      case Operator.LTE:
        return lte(column, value as string | number);

      case Operator.CONTAINS:
        return like(column, `%${value}%`);

      case Operator.NOT_CONTAINS:
        return notLike(column, `%${value}%`);

      case Operator.IN:
        if (!Array.isArray(value)) {
          throw new InvalidArgumentError("IN operator requires an array value");
        }
        return inArray(column, value);

      case Operator.NOT_IN:
        if (!Array.isArray(value)) {
          throw new InvalidArgumentError("NOT_IN operator requires an array value");
        }
        return notInArray(column, value);

      case Operator.IS_NULL:
        return isNull(column);

      case Operator.IS_NOT_NULL:
        return isNotNull(column);

      default:
        throw new InvalidArgumentError(`Unsupported operator: ${filter.operator.value}`);
    }
  }

  private mapField(domainField: string): string {
    if (this.fieldMapping[domainField]) {
      return this.fieldMapping[domainField];
    }
    return domainField;
  }

  private getColumn(columnName: string): T[keyof T] {
    const column = this.table[columnName];
    if (!column) {
      throw new InvalidArgumentError(`Invalid filter field: ${columnName}`);
    }
    return column;
  }
}
