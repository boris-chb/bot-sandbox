import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle/",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "production"
        ? process.env.DATABASE_URL_PRIVATE!
        : process.env.DATABASE_URL_PUBLIC!,
  },
});
