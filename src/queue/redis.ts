import type { RedisOptions } from "ioredis";

const host = process.env.REDIS_HOST || "127.0.0.1";
const port = Number(process.env.REDIS_PORT) || 6379;

export const connection: RedisOptions | string =
  process.env.NODE_ENV === "production"
    ? (process.env.REDIS_URL as string)
    : ({ host, port } as RedisOptions);
