import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const isProd = process.env.NODE_ENV === "production";
const dbUrl = isProd
  ? process.env.PRIVATE_DATABASE_URL
  : process.env.PUBLIC_DATABASE_URL;

const pool = new Pool({
  connectionString: dbUrl, // your railway private URL
});

export const db = drizzle(pool);
