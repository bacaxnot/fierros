import type { Criteria } from "../../../../shared/domain/criteria/criteria";
import type { Exercise } from "./exercise";
import type { ExerciseId } from "./exercise-id";

export abstract class ExerciseRepository {
  abstract save(exercise: Exercise): Promise<void>;
  abstract search(id: ExerciseId): Promise<Exercise | null>;
  abstract searchByCriteria(criteria: Criteria): Promise<Exercise[]>;
  abstract countByCriteria(criteria: Criteria): Promise<number>;
  abstract delete(id: ExerciseId): Promise<void>;
}
