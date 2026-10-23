import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const sourceRoot = resolve(projectRoot, "src");

export default defineConfig({
  root: sourceRoot,
  base: "./",
  publicDir: resolve(sourceRoot, "public"),
  input: [
    resolve(sourceRoot, "index.html"),
    resolve(sourceRoot, "pages/calculator.html"),
    resolve(sourceRoot, "pages/sobre.html"),
  ],
  build: {
    outDir: resolve(projectRoot, "dist"),
    emptyOutDir: true,
  },
});
