import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/rpc.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
  // Don't bundle external dependencies
  external: ["hono"],
  // TypeScript options
  tsconfig: "tsconfig.json",
  // DTS options
  dts: {
    resolve: true,
    eager: true,
    compilerOptions: {
      composite: false,
      incremental: false,
    },
  },
  target: false,
});
