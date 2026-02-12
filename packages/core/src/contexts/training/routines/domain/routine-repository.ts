import type { UserId } from "../../users/domain/user-id";
import type { Routine } from "./routine";
import type { RoutineId } from "./routine-id";

export abstract class RoutineRepository {
  abstract save(routine: Routine): Promise<void>;
  abstract search(id: RoutineId): Promise<Routine | null>;
  abstract searchByUserId(userId: UserId): Promise<Routine[]>;
  abstract delete(id: RoutineId): Promise<void>;
}
