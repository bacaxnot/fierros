export type FilterValueType = string | number | boolean | string[] | number[] | null;

export class FilterValue {
  constructor(public readonly value: FilterValueType) {}

  isArray(): boolean {
    return Array.isArray(this.value);
  }

  isNull(): boolean {
    return this.value === null;
  }
}
