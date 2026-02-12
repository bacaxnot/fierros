import type { UserId } from "../../users/domain/user-id";
import type { Exercise } from "./exercise";
import type { ExerciseId } from "./exercise-id";

export abstract class ExerciseRepository {
  abstract save(exercise: Exercise): Promise<void>;
  abstract search(id: ExerciseId): Promise<Exercise | null>;
  abstract searchByUserId(userId: UserId): Promise<Exercise[]>;
  abstract delete(id: ExerciseId): Promise<void>;
}
