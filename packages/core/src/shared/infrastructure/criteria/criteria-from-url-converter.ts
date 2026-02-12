import { Criteria, type CriteriaPrimitives } from "../../domain/criteria/criteria";
import type { FilterPrimitives } from "../../domain/criteria/filter";

/**
 * Converts URL query parameters to Criteria.
 *
 * URL Format:
 * - Filters: ?filters[0][field]=userId&filters[0][operator]==&filters[0][value]=123
 * - Sorting: ?orderBy=createdAt&orderType=DESC
 * - Pagination: ?pageSize=10&pageNumber=1
 *
 * Example full URL:
 * /api/notes?filters[0][field]=userId&filters[0][operator]==&filters[0][value]=abc-123&orderBy=createdAt&orderType=DESC&pageSize=10&pageNumber=1
 */
export class CriteriaFromUrlConverter {
  convert(url: URL): Criteria;
  convert(searchParams: URLSearchParams): Criteria;
  convert(urlOrParams: URL | URLSearchParams): Criteria {
    const searchParams = urlOrParams instanceof URL ? urlOrParams.searchParams : urlOrParams;
    const primitives = this.toPrimitives(searchParams);
    return Criteria.fromPrimitives(
      primitives.filters,
      primitives.orderBy,
      primitives.orderType,
      primitives.pageSize,
      primitives.pageNumber,
    );
  }

  toPrimitives(searchParams: URLSearchParams): CriteriaPrimitives {
    return {
      filters: this.parseFilters(searchParams),
      orderBy: this.parseOrderBy(searchParams),
      orderType: this.parseOrderType(searchParams),
      pageSize: this.parsePageSize(searchParams),
      pageNumber: this.parsePageNumber(searchParams),
    };
  }

  private parseFilters(searchParams: URLSearchParams): FilterPrimitives[] {
    const filters: Map<number, Partial<FilterPrimitives>> = new Map();

    for (const [key, value] of searchParams.entries()) {
      const match = key.match(/^filters\[(\d+)\]\[(\w+)\]$/);
      if (!match) continue;

      const index = parseInt(match[1], 10);
      const property = match[2] as keyof FilterPrimitives;

      if (!filters.has(index)) {
        filters.set(index, {});
      }

      const filter = filters.get(index)!;

      if (property === "field" || property === "operator") {
        filter[property] = value;
      } else if (property === "value") {
        filter.value = this.parseFilterValue(value);
      }
    }

    // Convert map to array and validate
    const result: FilterPrimitives[] = [];
    const sortedIndices = Array.from(filters.keys()).sort((a, b) => a - b);

    for (const index of sortedIndices) {
      const filter = filters.get(index)!;
      if (filter.field && filter.operator && filter.value !== undefined) {
        result.push({
          field: filter.field,
          operator: filter.operator,
          value: filter.value,
        });
      }
    }

    return result;
  }

  private parseFilterValue(value: string): string | number | boolean | string[] | null {
    // Handle null
    if (value === "null") return null;

    // Handle boolean
    if (value === "true") return true;
    if (value === "false") return false;

    // Handle arrays (comma-separated)
    if (value.includes(",")) {
      return value.split(",").map((v) => v.trim());
    }

    // Handle numbers
    const numValue = Number(value);
    if (!isNaN(numValue) && value.trim() !== "") {
      return numValue;
    }

    // Default to string
    return value;
  }

  private parseOrderBy(searchParams: URLSearchParams): string | null {
    return searchParams.get("orderBy");
  }

  private parseOrderType(searchParams: URLSearchParams): string | null {
    const orderType = searchParams.get("orderType");
    if (orderType && ["ASC", "DESC"].includes(orderType.toUpperCase())) {
      return orderType.toUpperCase();
    }
    return null;
  }

  private parsePageSize(searchParams: URLSearchParams): number | null {
    const pageSize = searchParams.get("pageSize");
    if (pageSize) {
      const parsed = parseInt(pageSize, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return null;
  }

  private parsePageNumber(searchParams: URLSearchParams): number | null {
    const pageNumber = searchParams.get("pageNumber");
    if (pageNumber) {
      const parsed = parseInt(pageNumber, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return null;
  }
}
