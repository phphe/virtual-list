import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export const pkg = require("./package.json");
export const banner = `
/*!
 * ${pkg.name} v${pkg.version}
 * Author: ${pkg.author}
 * Homepage: ${pkg.homepage || null}
 * Released under the ${pkg.license} License.
 */`.trim();

export const globals = {
  vue: "Vue",
  "vue-demi": "VueDemi",
  "helper-js": "helperJs",
};

export const name = "vitualListVue"; // for umd, iife

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outputDir: "types",
      staticImport: true,
      insertTypesEntry: true,
      logDiagnostics: true,
    }),
  ],
  optimizeDeps: {
    exclude: ["vue-demi"],
  },
  build: {
    outDir: "dist/v3",
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      name,
      fileName: "index",
      formats: ["es", "cjs", "iife"],
    },
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

export const externals = [
  ...Object.keys(pkg["dependencies"] || {}),
  ...Object.keys(pkg["peerDependencies"] || {}),
];

export function externalFunction(id) {
  id = id.replace(/\\/g, "/");
  for (const name of externals) {
    if (id.startsWith(name)) {
      return true;
    }
  }
  return false;
}
