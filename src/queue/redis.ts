import { env } from "@/env";
import type { ConnectionOptions } from "bullmq";
import type { RedisOptions } from "ioredis";

const redisURL = new URL(process.env.REDIS_URL!);

export const connection: ConnectionOptions = {
  family: 0,
  host: redisURL.hostname,
  port: +redisURL.port,
  username: redisURL.username,
  password: redisURL.password,
};
