import type { CriteriaPrimitives } from "../../domain/criteria/criteria";
import type { FilterPrimitives } from "../../domain/criteria/filter";
import type { FilterValueType } from "../../domain/criteria/filter-value";

/**
 * Query parameters type compatible with Hono RPC client.
 * All values are strings as required by the client.
 */
export type CriteriaQueryParams = Record<string, string>;

/**
 * Converts CriteriaPrimitives to query parameters for Hono RPC client.
 *
 * This is the inverse of CriteriaFromUrlConverter.
 *
 * Query params format:
 * - Filters: filters[0][field]=userId&filters[0][operator]=eq&filters[0][value]=123
 * - Sorting: orderBy=createdAt&orderType=DESC
 * - Pagination: pageSize=10&pageNumber=1
 *
 * Usage with Hono RPC client:
 * ```typescript
 * const converter = new CriteriaPrimitivesToQueryParamsConverter();
 * const query = converter.convert(criteriaPrimitives);
 * const response = await client.endpoint.$get({ query });
 * ```
 */
export class CriteriaPrimitivesToQueryParamsConverter {
  convert(primitives: CriteriaPrimitives): CriteriaQueryParams {
    const params: CriteriaQueryParams = {};

    this.addFilters(params, primitives.filters);
    this.addOrderBy(params, primitives.orderBy);
    this.addOrderType(params, primitives.orderType);
    this.addPageSize(params, primitives.pageSize);
    this.addPageNumber(params, primitives.pageNumber);

    return params;
  }

  private addFilters(
    params: CriteriaQueryParams,
    filters: FilterPrimitives[],
  ): void {
    filters.forEach((filter, index) => {
      params[`filters[${index}][field]`] = filter.field;
      params[`filters[${index}][operator]`] = filter.operator;
      params[`filters[${index}][value]`] = this.serializeFilterValue(
        filter.value,
      );
    });
  }

  private serializeFilterValue(value: FilterValueType): string {
    if (value === null) {
      return "null";
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }

    if (Array.isArray(value)) {
      return value.join(",");
    }

    return String(value);
  }

  private addOrderBy(
    params: CriteriaQueryParams,
    orderBy: string | null,
  ): void {
    if (orderBy !== null) {
      params.orderBy = orderBy;
    }
  }

  private addOrderType(
    params: CriteriaQueryParams,
    orderType: string | null,
  ): void {
    if (orderType !== null) {
      params.orderType = orderType;
    }
  }

  private addPageSize(
    params: CriteriaQueryParams,
    pageSize: number | null,
  ): void {
    if (pageSize !== null) {
      params.pageSize = String(pageSize);
    }
  }

  private addPageNumber(
    params: CriteriaQueryParams,
    pageNumber: number | null,
  ): void {
    if (pageNumber !== null) {
      params.pageNumber = String(pageNumber);
    }
  }
}
