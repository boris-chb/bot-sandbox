import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const isProd = process.env.NODE_ENV === "production";
const dbUrl = isProd
  ? process.env.DATABASE_PRIVATE_URL
  : process.env.DATABASE_PUBLIC_URL;

const pool = new Pool({
  connectionString: dbUrl, // your railway private URL
});

export const db = drizzle(pool);
