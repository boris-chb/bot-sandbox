import { db } from "@/db";
import { players, userPlayers } from "@/db/schema";
import { handleDbError } from "@/db/utils";
import { logger } from "@/utils/logger";
import { and, eq, type InferInsertModel } from "drizzle-orm";

export type Player = InferInsertModel<typeof players>;

export async function addPlayer(userId: number, player: Player) {
  try {
    // Try inserting the player
    const insertedPlayers = await db
      .insert(players)
      .values(player)
      .onConflictDoNothing({ target: players.name })
      .returning()
      .execute();

    let currentPlayer;

    if (insertedPlayers.length > 0) {
      // Player does not exist
      currentPlayer = insertedPlayers[0];
    } else {
      // Player already exists
      const existingPlayers = await db
        .select()
        .from(players)
        .where(eq(players.name, player.name))
        .limit(1)
        .execute();

      if (existingPlayers.length === 0) {
        throw new Error(`Failed to find or insert player: ${player.name}`);
      }

      currentPlayer = existingPlayers[0];
    }

    // Link user with player
    const result = await db
      .insert(userPlayers)
      .values({ userId, playerId: currentPlayer.id })
      .onConflictDoNothing({
        target: [userPlayers.userId, userPlayers.playerId],
      })
      .returning()
      .execute();

    if (result.length === 0) {
      logger.info(
        `User ${userId} tried to link already existing player ${currentPlayer.id}`
      );
      return {
        status: "already_linked" as const,
        player: currentPlayer,
      };
    }

    logger.info(`Player ${currentPlayer.id} linked to user ${userId}`);
    return {
      status: "created" as const,
      player: currentPlayer,
    };
  } catch (err: any) {
    handleDbError(err, "addPlayer");
    return {
      status: "error" as const,
      player: null,
    };
  }
}

export async function deletePlayer(userId: number, playerId: number) {
  try {
    // Remove the link between user and player
    const result = await db
      .delete(userPlayers)
      .where(
        and(eq(userPlayers.userId, userId), eq(userPlayers.playerId, playerId))
      )
      .execute();

    if (result.rowCount === 0) {
      return { message: "Персонаж не найден." };
    }

    // Optionally, delete the player entirely if no other users are linked
    const otherLinks = await db
      .select()
      .from(userPlayers)
      .where(eq(userPlayers.playerId, playerId))
      .limit(1)
      .execute();

    if (otherLinks.length === 0) {
      const res = await db
        .delete(players)
        .where(eq(players.id, playerId))
        .execute();
      if (res.rowCount && res.rowCount > 0) {
        logger.info(`Player ${playerId} deleted from user ${userId}`);
      }
    }

    return { message: "Персонаж удалён успешно." };
  } catch (err: any) {
    handleDbError(err, "deletePlayer");
    return null;
  }
}
