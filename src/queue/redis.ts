import Redis from "ioredis";
import type { RedisOptions } from "ioredis";

export const connection: RedisOptions =
  process.env.NODE_ENV === "production"
    ? (Redis.prototype.options = new Redis(process.env.REDIS_URL!).options)
    : {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
      };
