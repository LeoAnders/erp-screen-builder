import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname) },
      { find: "@/", replacement: path.resolve(__dirname) + "/" },
      { find: "@/lib", replacement: path.resolve(__dirname, "lib") },
      {
        find: "@/components",
        replacement: path.resolve(__dirname, "components"),
      },
      { find: "@/app", replacement: path.resolve(__dirname, "app") },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  },
});
