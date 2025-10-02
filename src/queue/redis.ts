import Redis from "ioredis";

export const redis =
  process.env.NODE_ENV === "production"
    ? // Railway
      new Redis(process.env.REDIS_URL!)
    : // Local
      new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
      });
