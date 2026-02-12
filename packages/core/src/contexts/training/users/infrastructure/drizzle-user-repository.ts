import { db } from "@repo/db";
import { authUser } from "@repo/db/schema";
import { eq } from "@repo/db/orm";
import { User } from "../domain/user";
import type { UserId } from "../domain/user-id";

export class DrizzleUserRepository {
  async save(user: User): Promise<void> {
    const p = user.toPrimitives();
    await db
      .update(authUser)
      .set({
        name: p.name,
        updatedAt: new Date(p.updatedAt),
      })
      .where(eq(authUser.id, p.id));
  }

  async search(id: UserId): Promise<User | null> {
    const rows = await db
      .select({
        id: authUser.id,
        name: authUser.name,
        createdAt: authUser.createdAt,
        updatedAt: authUser.updatedAt,
      })
      .from(authUser)
      .where(eq(authUser.id, id.value));

    return rows[0] ? this.toEntity(rows[0]) : null;
  }

  async delete(id: UserId): Promise<void> {
    await db.delete(authUser).where(eq(authUser.id, id.value));
  }

  private toEntity(row: {
    id: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.fromPrimitives({
      id: row.id,
      name: row.name ?? "",
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }
}
