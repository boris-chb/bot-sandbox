import type { RedisOptions } from "ioredis";

export const connection: RedisOptions =
  process.env.NODE_ENV === "production" && process.env.REDIS_URL
    ? {
        // ioredis will handle the URL parsing
        ...(process.env.REDIS_URL.startsWith("rediss://") && { tls: {} }),
      }
    : {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
      };
