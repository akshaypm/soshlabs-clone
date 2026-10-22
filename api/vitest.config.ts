import "dotenv/config";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    hookTimeout: 30_000,
    testTimeout: 20_000,
  },
});
