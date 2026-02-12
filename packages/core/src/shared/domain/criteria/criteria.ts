import { Filter, type FilterPrimitives } from "./filter";
import { Filters } from "./filters";
import { Order } from "./order";
import { Operator } from "./filter-operator";
import { Pagination } from "./pagination";
import type { FilterValueType } from "./filter-value";

export type CriteriaPrimitives = {
  filters: FilterPrimitives[];
  orderBy: string | null;
  orderType: string | null;
  pageSize: number | null;
  pageNumber: number | null;
};

export class Criteria {
  constructor(
    public readonly filters: Filters,
    public readonly order: Order,
    public readonly pagination: Pagination,
  ) {}

  static fromPrimitives(
    filters: FilterPrimitives[],
    orderBy: string | null,
    orderType: string | null,
    pageSize: number | null,
    pageNumber: number | null,
  ): Criteria {
    return new Criteria(
      Filters.fromPrimitives(filters),
      Order.fromPrimitives(orderBy, orderType),
      Pagination.fromPrimitives(pageSize, pageNumber),
    );
  }

  static empty(): Criteria {
    return new Criteria(Filters.none(), Order.none(), Pagination.none());
  }

  hasFilters(): boolean {
    return !this.filters.isEmpty();
  }

  hasOrder(): boolean {
    return this.order.hasOrder();
  }

  hasPagination(): boolean {
    return this.pagination.hasPagination();
  }

  toPrimitives(): CriteriaPrimitives {
    return {
      filters: this.filters.toPrimitives(),
      orderBy: this.order.hasOrder() ? this.order.orderBy.value : null,
      orderType: this.order.hasOrder() ? this.order.orderType.value : null,
      pageSize: this.pagination.pageSize,
      pageNumber: this.pagination.pageNumber,
    };
  }
}

export class CriteriaBuilder {
  private _filters: Filter[] = [];
  private _order: Order = Order.none();
  private _pagination: Pagination = Pagination.none();

  static fromPrimitives(primitives: CriteriaPrimitives): Criteria {
    return Criteria.fromPrimitives(
      primitives.filters,
      primitives.orderBy,
      primitives.orderType,
      primitives.pageSize,
      primitives.pageNumber,
    );
  }

  filter(field: string, operator: Operator, value: FilterValueType): this {
    this._filters.push(Filter.create(field, operator, value));
    return this;
  }

  equal(field: string, value: FilterValueType): this {
    return this.filter(field, Operator.EQUAL, value);
  }

  notEqual(field: string, value: FilterValueType): this {
    return this.filter(field, Operator.NOT_EQUAL, value);
  }

  greaterThan(field: string, value: FilterValueType): this {
    return this.filter(field, Operator.GT, value);
  }

  greaterThanOrEqual(field: string, value: FilterValueType): this {
    return this.filter(field, Operator.GTE, value);
  }

  lessThan(field: string, value: FilterValueType): this {
    return this.filter(field, Operator.LT, value);
  }

  lessThanOrEqual(field: string, value: FilterValueType): this {
    return this.filter(field, Operator.LTE, value);
  }

  contains(field: string, value: string): this {
    return this.filter(field, Operator.CONTAINS, value);
  }

  notContains(field: string, value: string): this {
    return this.filter(field, Operator.NOT_CONTAINS, value);
  }

  in(field: string, values: string[] | number[]): this {
    return this.filter(field, Operator.IN, values);
  }

  notIn(field: string, values: string[] | number[]): this {
    return this.filter(field, Operator.NOT_IN, values);
  }

  isNull(field: string): this {
    return this.filter(field, Operator.IS_NULL, null);
  }

  isNotNull(field: string): this {
    return this.filter(field, Operator.IS_NOT_NULL, null);
  }

  orderByAsc(field: string): this {
    this._order = Order.asc(field);
    return this;
  }

  orderByDesc(field: string): this {
    this._order = Order.desc(field);
    return this;
  }

  paginate(pageSize: number, pageNumber: number = 1): this {
    this._pagination = new Pagination(pageSize, pageNumber);
    return this;
  }

  build(): Criteria {
    return new Criteria(new Filters(this._filters), this._order, this._pagination);
  }
}
