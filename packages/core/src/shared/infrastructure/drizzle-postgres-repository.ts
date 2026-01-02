import { db } from "@repo/db";
import type { AggregateRoot } from "../domain/aggregate-root";

export abstract class DrizzlePostgresRepository<T extends AggregateRoot> {
  protected readonly db = db;

  protected abstract toAggregate(row: unknown): T;
}
