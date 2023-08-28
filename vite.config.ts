import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig(({}) => ({
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      name: "orderable-list",
      fileName: "orderable-list",
    },
    rollupOptions: {
      plugins: [peerDepsExternal()],
    },
  },
  plugins: [react(), dts(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      src: `${__dirname}/src`,
      list: `${__dirname}/src/list`,
    },
  },
}));
