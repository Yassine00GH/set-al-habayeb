import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/__tests__/setup.ts"],
      globals: false,
    },
  }),
);
