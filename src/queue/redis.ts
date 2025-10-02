import type { RedisOptions } from "ioredis";

export const connection: RedisOptions = {
  host: process.env.REDISHOST || "localhost",
  port: Number(process.env.REDISPORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDISUSER,
  tls: {},
};

console.log(connection);
