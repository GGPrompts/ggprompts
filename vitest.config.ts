import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // Common test configuration for all packages
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    passWithNoTests: true,
  },
})
