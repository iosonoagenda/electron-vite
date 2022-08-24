import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import electron from "vite-plugin-electron";


// https://vitejs.dev/config/
export default defineConfig({
  base: path.resolve(__dirname, 'dist'),
  plugins: [
    vue(),
    electron({
      main: {
        entry: path.resolve(__dirname, 'main.js'),
      },
      preload: {
        input: {
          preload: path.resolve(__dirname, 'build', 'preload.js'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
