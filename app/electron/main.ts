import * as config from "./config"
import { app, BrowserWindow } from "electron"
import { autoUpdater } from "electron-updater"
import wins from "./src/wins"
import ipc from "./src/ipc"

const Windows = new wins(config)

// 单实例锁
const gotTheLock = app.requestSingleInstanceLock()

// 限制单开应用实例
if (!gotTheLock) app.quit()

// 判断应用是否已打包
if (app.isPackaged) {
  // 自动更新下载
  autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall()
  })
} else {
  // 忽略证书相关错误
  app.commandLine.appendSwitch("ignore-certificate-errors")
  // 关闭安全策略警告
  process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "false"
}

// 网页内容创建事件
app.on("web-contents-created", (event, win) => {
  // 禁止 webviewTag
  win.on("will-attach-webview", event => event.preventDefault())
})

// 窗口创建事件
app.on("browser-window-created", (event, win) => {
  // 判断是否为模态窗口或子窗口
  if (!win.isModal() || !win.getParentWindow()) {
    Windows.setup(win)
  }
})

// 多开触发事件
app.on("second-instance", (event, commandLine, workingDirectory) => {
  const wins = BrowserWindow.getAllWindows()

  // 恢复窗口
  if (wins && wins[0]) {
    if (wins[0].isMinimized()) wins[0].restore()
    wins[0].focus()
  }
})

// 应用就绪事件
app.on("ready", () => {
  ipc() // 初始化进程通讯模块

  Windows.setupWorkAreaSize()
  Windows.createWindow()
})

// 应用关闭事件
app.on("window-all-closed", () => {
  app.quit()
})

// 应用崩溃重启
app.on("render-process-gone", () => {
  app.relaunch()
  app.quit()
})
