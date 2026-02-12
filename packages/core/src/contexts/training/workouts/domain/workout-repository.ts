import type { Criteria } from "../../../../shared/domain/criteria/criteria";
import type { UserId } from "../../users/domain/user-id";
import type { Workout } from "./workout";
import type { WorkoutId } from "./workout-id";

export abstract class WorkoutRepository {
  abstract save(workout: Workout): Promise<void>;
  abstract search(id: WorkoutId): Promise<Workout | null>;
  abstract searchByUserId(userId: UserId): Promise<Workout[]>;
  abstract searchByCriteria(criteria: Criteria): Promise<Workout[]>;
  abstract countByCriteria(criteria: Criteria): Promise<number>;
  abstract delete(id: WorkoutId): Promise<void>;
}
