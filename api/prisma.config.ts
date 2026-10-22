import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL?.trim();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Generate can run before a developer copies .env. Migrate and the server
    // still require a real DATABASE_URL; this fallback matches docker-compose.
    url: databaseUrl && databaseUrl.length > 0
      ? databaseUrl
      : "postgresql://sosh:sosh@localhost:5432/sosh",
  },
});
