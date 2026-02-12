import type { Criteria } from "../../../../shared/domain/criteria/criteria";
import type { UserId } from "../../users/domain/user-id";
import type { Routine } from "./routine";
import type { RoutineId } from "./routine-id";

export abstract class RoutineRepository {
  abstract save(routine: Routine): Promise<void>;
  abstract search(id: RoutineId): Promise<Routine | null>;
  abstract searchByUserId(userId: UserId): Promise<Routine[]>;
  abstract searchByCriteria(criteria: Criteria): Promise<Routine[]>;
  abstract countByCriteria(criteria: Criteria): Promise<number>;
  abstract delete(id: RoutineId): Promise<void>;
}
