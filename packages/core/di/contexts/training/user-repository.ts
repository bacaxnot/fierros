import type { ContainerBuilder } from "diod";
import { UserRepository } from "../../../src/contexts/training/users/domain/user-repository";
import { DrizzleUserRepository } from "../../../src/contexts/training/users/infrastructure/drizzle-user-repository";

export function register(builder: ContainerBuilder) {
  builder.register(UserRepository).use(DrizzleUserRepository);
}
