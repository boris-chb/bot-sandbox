import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(telegramId: number, username: string) {
  // select returns an array
  let [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, telegramId))
    .limit(1);

  if (!user) {
    const [insertedUser] = await db
      .insert(users)
      .values({ id: telegramId, username })
      .returning();
    user = insertedUser;
  }

  return user;
}
