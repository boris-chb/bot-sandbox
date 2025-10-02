import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle/",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "production"
        ? process.env.PRIVATE_DATABASE_URL!
        : process.env.PUBLIC_DATABASE_URL!,
  },
});
