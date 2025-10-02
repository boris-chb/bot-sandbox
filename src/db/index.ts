import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const isProd = process.env.NODE_ENV === "production";
const dbUrl = isProd
  ? process.env.DATABASE_URL_PRIVATE
  : process.env.DATABASE_URL_PUBLIC;

const pool = new Pool({
  connectionString: dbUrl, // your railway private URL
});

export const db = drizzle(pool);
