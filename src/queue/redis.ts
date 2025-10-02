import { env } from "@/env";
import type { ConnectionOptions } from "bullmq";
import type { RedisOptions } from "ioredis";

export const connection: ConnectionOptions = {
  host: env.REDISHOST,
  port: env.REDISPORT,
  username: env.REDISUSER,
  password: env.REDISPASSWORD,
};
