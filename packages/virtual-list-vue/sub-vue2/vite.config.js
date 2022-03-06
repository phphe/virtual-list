import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";

import {
  pkg,
  banner,
  externalFunction,
  globals,
  name,
} from "../vite.config.js";

export default defineConfig({
  plugins: [createVuePlugin()],
  optimizeDeps: {
    exclude: ["vue-demi"],
  },
  build: {
    outDir: "../dist/v2",
    sourcemap: true,
    lib: {
      entry: "../src/index.ts",
      name,
      fileName: "index",
      formats: ["es", "cjs", "iife"],
    },
    emptyOutDir: true,
    rollupOptions: {
      external: externalFunction,
      output: {
        banner,
        exports: "auto",
        globals,
      },
    },
  },
});
