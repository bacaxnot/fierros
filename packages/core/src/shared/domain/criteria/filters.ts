import { Filter, type FilterPrimitives } from "./filter";

export class Filters {
  constructor(public readonly value: Filter[]) {}

  static fromPrimitives(filters: FilterPrimitives[]): Filters {
    return new Filters(filters.map((f) => Filter.fromPrimitives(f.field, f.operator, f.value)));
  }

  static none(): Filters {
    return new Filters([]);
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  toPrimitives(): FilterPrimitives[] {
    return this.value.map((f) => f.toPrimitives());
  }
}
