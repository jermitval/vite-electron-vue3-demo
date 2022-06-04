import { defineConfig } from "vite"
import { builtinModules } from "module"

export default (set: any) => {
  process.env.NODE_ENV = set.mode

  console.log("[env]", process.env.NODE_ENV)
  console.log("[entry]", import.meta.url)
  return defineConfig({
    mode: process.env.NODE_ENV || "development",
    root: __dirname,
    envDir: process.cwd(),
    build: {
      sourcemap: "inline",
      outDir: "../../dist.electron",
      assetsDir: ".",
      minify: process.env.NODE_ENV !== "development",
      lib: {
        entry: "./main.ts",
        formats: ["cjs"]
      },
      rollupOptions: {
        external: [...builtinModules, "electron", "axios"],
        output: {
          entryFileNames: "[name].cjs"
        }
      },
      emptyOutDir: true,
      brotliSize: false
    }
  })
}
