import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import { join } from "path"
import { proxy } from "../config"

const config = loadEnv("/", __dirname)

export default (set: any) => {
  process.env.NODE_ENV = set.mode

  console.log("[env]", process.env.NODE_ENV)
  console.log("[entry]", import.meta.url)
  return defineConfig({
    mode: process.env.NODE_ENV || "development",
    plugins: [vue()],
    root: __dirname,
    base: "./",
    publicDir: "./public",
    build: {
      outDir: "../../dist.vue",
      assetsDir: "./src"
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "app/vue/src/assets/style/global.scss";`
        }
      }
    },
    resolve: {
      alias: {
        "@": join(__dirname, "src")
      }
    },
    server: {
      proxy: proxy,
      https: true
    }
  })
}
