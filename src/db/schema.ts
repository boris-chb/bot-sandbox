import { integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  username: text("username"),
});

export const players = pgTable("players", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  nickname: text("nickname").notNull(),
  password: text("password").notNull(),
  cookies: text("cookies").notNull(),
  email: text("email").notNull(),
  level: integer("level").notNull(),
});

export const userPlayers = pgTable(
  "user_players",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.playerId] })]
);
