import type { RedisOptions } from "ioredis";

export const connection: RedisOptions = {
  host: "interchange.proxy.rlwy.net",
  port: 28900,
  username: "default",
  password: "YGkUkiWRSIutrgPLpsSjEuDKcRmIeiZp",
  tls: {}, // because Railway public Redis requires TLS
};

console.log(connection);
