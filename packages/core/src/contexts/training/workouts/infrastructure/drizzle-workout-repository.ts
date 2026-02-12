import { workouts } from "@repo/db/schema";
import { eq, sql } from "@repo/db/orm";
import type { Criteria } from "../../../../shared/domain/criteria/criteria";
import {
  CriteriaToDrizzleConverter,
  type FieldMapping,
} from "../../../../shared/infrastructure/criteria/criteria-to-drizzle-converter";
import { DrizzlePostgresRepository } from "../../../../shared/infrastructure/drizzle-postgres-repository";
import type { UserId } from "../../users/domain/user-id";
import { Workout, type WorkoutPrimitives } from "../domain/workout";
import type { WorkoutBlockPrimitives } from "../domain/workout-block";
import type { WorkoutId } from "../domain/workout-id";

const FIELD_MAPPING: FieldMapping = {};

export class DrizzleWorkoutRepository extends DrizzlePostgresRepository<Workout> {
  private readonly criteriaConverter = new CriteriaToDrizzleConverter(
    workouts,
    FIELD_MAPPING,
  );

  async save(workout: Workout): Promise<void> {
    const p = workout.toPrimitives();
    await this.db
      .insert(workouts)
      .values({
        id: p.id,
        userId: p.userId,
        routineId: p.routineId,
        name: p.name,
        startedAt: p.startedAt,
        finishedAt: p.finishedAt,
        notes: p.notes,
        blocks: p.blocks,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })
      .onConflictDoUpdate({
        target: workouts.id,
        set: {
          name: p.name,
          finishedAt: p.finishedAt,
          notes: p.notes,
          blocks: p.blocks,
          updatedAt: p.updatedAt,
        },
      });
  }

  async search(id: WorkoutId): Promise<Workout | null> {
    const rows = await this.db
      .select()
      .from(workouts)
      .where(eq(workouts.id, id.value));

    return rows[0] ? this.toAggregate(rows[0]) : null;
  }

  async searchByUserId(userId: UserId): Promise<Workout[]> {
    const rows = await this.db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId.value));

    return rows.map((row) => this.toAggregate(row));
  }

  async searchByCriteria(criteria: Criteria): Promise<Workout[]> {
    const { where, orderBy, limit, offset } =
      this.criteriaConverter.convert(criteria);

    let query = this.db.select().from(workouts).$dynamic();
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
      .from(workouts)
      .$dynamic();

    if (where) query = query.where(where);

    const [result] = await query;
    return result.count;
  }

  async delete(id: WorkoutId): Promise<void> {
    await this.db.delete(workouts).where(eq(workouts.id, id.value));
  }

  protected toAggregate(row: typeof workouts.$inferSelect): Workout {
    return Workout.fromPrimitives({
      id: row.id,
      userId: row.userId,
      routineId: row.routineId,
      name: row.name,
      startedAt: row.startedAt,
      finishedAt: row.finishedAt,
      notes: row.notes,
      blocks: row.blocks as WorkoutBlockPrimitives[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
