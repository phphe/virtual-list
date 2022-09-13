import { defineConfig, LibraryFormats } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
export const pkg = require("./package.json");

// ============================ config area ============================
export const name = "virtualListReact"; // for umd, iife
export const banner = `
/*!
 * ${pkg.name}
 * Author: ${pkg.author}
 * Homepage: ${pkg.homepage || null}
 * Released under the ${pkg.license} License.
 */`.trim();
/**
 * globals are externals for iife format
 */
export const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  "styled-components": "styled",
};
// ============================ config area end ============================

// https://vitejs.dev/config/
export const isIIFE = detectIIFE();
export const formats: LibraryFormats[] = !isIIFE ? ["es", "cjs"] : ["iife"];
export default defineConfig({
  plugins: [
    react(),
    !isIIFE &&
      dts({
        outputDir: "types",
        staticImport: true,
        insertTypesEntry: true,
        logDiagnostics: true,
      }),
  ],
  build: {
    sourcemap: isIIFE,
    emptyOutDir: !isIIFE,
    lib: {
      entry: "src/index.ts",
      name,
      fileName: "index",
      formats,
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

export const esmExternals = [
  ...Object.keys(pkg["dependencies"] || {}),
  ...Object.keys(pkg["peerDependencies"] || {}),
];
export const iifeExternals = [
  ...Object.keys(globals),
  ...Object.keys(pkg["peerDependencies"] || {}),
];

export function externalFunction(id) {
  id = id.replace(/\\/g, "/");
  const externals = isIIFE ? iifeExternals : esmExternals;
  for (const name of externals) {
    if (id.startsWith(name)) {
      return true;
    }
  }
  return false;
}

function detectIIFE() {
  let index = process.argv.indexOf("--");
  if (index > -1 && process.argv.indexOf("--iife", index + 1) > -1) {
    return true;
  }
  return false;
}
