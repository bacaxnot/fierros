import { exercises } from "@repo/db/schema";
import { eq, sql } from "@repo/db/orm";
import type { Criteria } from "../../../../shared/domain/criteria/criteria";
import {
  CriteriaToDrizzleConverter,
  type FieldMapping,
} from "../../../../shared/infrastructure/criteria/criteria-to-drizzle-converter";
import { DrizzlePostgresRepository } from "../../../../shared/infrastructure/drizzle-postgres-repository";
import { Exercise, type ExercisePrimitives } from "../domain/exercise";
import type { ExerciseId } from "../domain/exercise-id";
import type { ExerciseTargetMusclePrimitives } from "../domain/exercise-target-muscle";

const FIELD_MAPPING: FieldMapping = {};

export class DrizzleExerciseRepository extends DrizzlePostgresRepository<Exercise> {
  private readonly criteriaConverter = new CriteriaToDrizzleConverter(
    exercises,
    FIELD_MAPPING,
  );

  async save(exercise: Exercise): Promise<void> {
    const p = exercise.toPrimitives();
    await this.db
      .insert(exercises)
      .values({
        id: p.id,
        name: p.name,
        description: p.description,
        userId: p.userId,
        targetMuscles: p.targetMuscles,
        defaultMetrics: p.defaultMetrics,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })
      .onConflictDoUpdate({
        target: exercises.id,
        set: {
          name: p.name,
          description: p.description,
          targetMuscles: p.targetMuscles,
          defaultMetrics: p.defaultMetrics,
          updatedAt: p.updatedAt,
        },
      });
  }

  async search(id: ExerciseId): Promise<Exercise | null> {
    const rows = await this.db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id.value));

    return rows[0] ? this.toAggregate(rows[0]) : null;
  }

  async searchByCriteria(criteria: Criteria): Promise<Exercise[]> {
    const { where, orderBy, limit, offset } =
      this.criteriaConverter.convert(criteria);

    let query = this.db.select().from(exercises).$dynamic();
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
      .from(exercises)
      .$dynamic();

    if (where) query = query.where(where);

    const [result] = await query;
    return result.count;
  }

  async delete(id: ExerciseId): Promise<void> {
    await this.db.delete(exercises).where(eq(exercises.id, id.value));
  }

  protected toAggregate(row: typeof exercises.$inferSelect): Exercise {
    return Exercise.fromPrimitives({
      id: row.id,
      name: row.name,
      description: row.description,
      userId: row.userId,
      targetMuscles: row.targetMuscles as ExerciseTargetMusclePrimitives[],
      defaultMetrics: row.defaultMetrics as string[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
