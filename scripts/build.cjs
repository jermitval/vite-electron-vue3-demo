const { build } = require("vite")

process.env.NODE_ENV = "production"

/** exec */
;(async () => {
  try {
    const totalTimeLabel = "Total bundling time"
    console.time(totalTimeLabel)

    await build({
      mode: process.env.NODE_ENV,
      configFile: "app/electron/vite.config.ts"
    })

    console.log("\n")
    console.timeEnd(totalTimeLabel)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
