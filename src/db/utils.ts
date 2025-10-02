import { logger } from "@/utils/logger";

export class DbError extends Error {
  constructor(public cause: any, public context?: string) {
    super(cause?.message || "Database error");
    this.name = "DbError";
  }
}

export function handleDbError(err: any, context?: string) {
  const cause = err.cause || err.originalError || err;

  // Capture a clean stack starting from your code
  const stack = new Error().stack
    ?.split("\n")
    .map((l) => l.trim())
    .slice(2);

  if (cause.code) {
    switch (cause.code) {
      case "23505":
        logger.error(
          { err: cause, context, stack },
          `Unique constraint violation`
        );
        break;
      case "23502":
        logger.error({ err: cause, context, stack }, `Not-null violation`);
        break;
      default:
        logger.error(
          { err: cause, context, stack },
          `Database error [${cause.code}]`
        );
    }
  } else {
    logger.error({ err: cause, context, stack }, "Unknown database error");
  }
}
