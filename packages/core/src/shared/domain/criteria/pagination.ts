import { InvalidArgumentError } from "../domain-error";

export type PaginationPrimitives = {
  pageSize: number | null;
  pageNumber: number | null;
};

export class Pagination {
  constructor(
    public readonly pageSize: number | null,
    public readonly pageNumber: number | null,
  ) {
    this.ensureIsValid();
  }

  private ensureIsValid(): void {
    if (this.pageSize !== null && this.pageSize < 1) {
      throw new InvalidArgumentError("Page size must be greater than 0");
    }
    if (this.pageNumber !== null && this.pageNumber < 1) {
      throw new InvalidArgumentError("Page number must be greater than 0");
    }
  }

  static fromPrimitives(pageSize: number | null, pageNumber: number | null): Pagination {
    return new Pagination(pageSize, pageNumber);
  }

  static none(): Pagination {
    return new Pagination(null, null);
  }

  hasPagination(): boolean {
    return this.pageSize !== null;
  }

  get offset(): number | null {
    if (this.pageSize === null || this.pageNumber === null) return null;
    return (this.pageNumber - 1) * this.pageSize;
  }

  get limit(): number | null {
    return this.pageSize;
  }
}
