import { db } from "@repo/db";
import { exerciseMetrics } from "@repo/db/schema";
import { eq } from "@repo/db/orm";
import { ExerciseMetric } from "../domain/exercise-metric";
import type { ExerciseMetricId } from "../domain/exercise-metric-id";

export class DrizzleExerciseMetricRepository {
  async search(id: ExerciseMetricId): Promise<ExerciseMetric | null> {
    const rows = await db
      .select()
      .from(exerciseMetrics)
      .where(eq(exerciseMetrics.id, id.value));

    return rows[0] ? this.toEntity(rows[0]) : null;
  }

  async searchAll(): Promise<ExerciseMetric[]> {
    const rows = await db.select().from(exerciseMetrics);
    return rows.map((row) => this.toEntity(row));
  }

  private toEntity(row: typeof exerciseMetrics.$inferSelect): ExerciseMetric {
    return ExerciseMetric.fromPrimitives({
      id: row.id,
      name: row.name,
      type: row.type,
      relation: row.relation,
    });
  }
}
