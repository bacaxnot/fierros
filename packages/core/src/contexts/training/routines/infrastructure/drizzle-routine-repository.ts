import { routines } from "@repo/db/schema";
import { eq, sql } from "@repo/db/orm";
import type { Criteria } from "../../../../shared/domain/criteria/criteria";
import {
  CriteriaToDrizzleConverter,
  type FieldMapping,
} from "../../../../shared/infrastructure/criteria/criteria-to-drizzle-converter";
import { DrizzlePostgresRepository } from "../../../../shared/infrastructure/drizzle-postgres-repository";
import { Routine, type RoutinePrimitives } from "../domain/routine";
import type { RoutineBlockPrimitives } from "../domain/routine-block";
import type { RoutineId } from "../domain/routine-id";

const FIELD_MAPPING: FieldMapping = {};

export class DrizzleRoutineRepository extends DrizzlePostgresRepository<Routine> {
  private readonly criteriaConverter = new CriteriaToDrizzleConverter(
    routines,
    FIELD_MAPPING,
  );

  async save(routine: Routine): Promise<void> {
    const p = routine.toPrimitives();
    await this.db
      .insert(routines)
      .values({
        id: p.id,
        name: p.name,
        description: p.description,
        userId: p.userId,
        blocks: p.blocks,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })
      .onConflictDoUpdate({
        target: routines.id,
        set: {
          name: p.name,
          description: p.description,
          blocks: p.blocks,
          updatedAt: p.updatedAt,
        },
      });
  }

  async search(id: RoutineId): Promise<Routine | null> {
    const rows = await this.db
      .select()
      .from(routines)
      .where(eq(routines.id, id.value));

    return rows[0] ? this.toAggregate(rows[0]) : null;
  }

  async searchByCriteria(criteria: Criteria): Promise<Routine[]> {
    const { where, orderBy, limit, offset } =
      this.criteriaConverter.convert(criteria);

    let query = this.db.select().from(routines).$dynamic();
    if (where) query = query.where(where);
    if (orderBy) query = query.orderBy(orderBy);
    if (limit !== undefined) query = query.limit(limit);
    if (offset !== undefined) query = query.offset(offset);

    const rows = await query;
    return rows.map((row) => this.toAggregate(row));
  }

  async countByCriteria(criteria: Criteria): Promise<number> {
    const { where } = this.criteriaConverter.convert(criteria);

    let query = this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(routines)
      .$dynamic();

    if (where) query = query.where(where);

    const [result] = await query;
    return result.count;
  }

  async delete(id: RoutineId): Promise<void> {
    await this.db.delete(routines).where(eq(routines.id, id.value));
  }

  protected toAggregate(row: typeof routines.$inferSelect): Routine {
    return Routine.fromPrimitives({
      id: row.id,
      name: row.name,
      description: row.description,
      userId: row.userId,
      blocks: row.blocks as RoutineBlockPrimitives[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
