import type { User } from "./user";
import type { UserId } from "./user-id";

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract search(id: UserId): Promise<User | null>;
  abstract delete(id: UserId): Promise<void>;
}
