const electron = require("electron")
const { build, createLogger } = require("vite")
const { spawn } = require("child_process")

process.env.NODE_ENV = "development"

/** create file watcher */
const createWatcher = plugin => {
  return build({
    mode: process.env.NODE_ENV,
    build: {
      watch: { buildDelay: 0 }
    },
    configFile: "app/electron/vite.config.ts",
    plugins: [plugin]
  })
}

/** setup electron app */
const setup = async () => {
  const logger = createLogger("info")
  let elc = null
  return createWatcher({
    name: "rollup-plugin-watcher",
    watchChange() {
      elc.kill("SIGINT")
      elc = null
    },
    writeBundle() {
      elc = spawn(String(electron), ["."])
      elc.stdout.on("data", data => logger.warn(data.toString().trim()))
      elc.stderr.on("data", error => logger.error(error.toString().trim()))
    }
  })
}

/** exec */
;(async () => {
  try {
    await setup()
  } catch (error) {
    console.error("[setup]", error)
    process.exit(1)
  }
})()
