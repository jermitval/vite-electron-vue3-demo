import { resolve } from "path"
import { app } from "electron"

/** 是否为 MacOS 系统环境 */
export const isMac = process.platform === "darwin"

/** 是否开启即时通讯 */
export const ws = false

/** 主页地址列表 */
export const indexURLs = {
  production: "dist.vue/index.html",
  development: "https://localhost:3000/"
}

/** 主页地址 */
export const indexURL = app.isPackaged
  ? resolve(app.getAppPath(), indexURLs.production)
  : indexURLs.development

/** 窗口默认配置 */
export const win: Electron.BrowserWindowConstructorOptions = {
  width: 1360,
  height: 1024,
  minWidth: 1025,
  minHeight: 680,
  thickFrame: true,
  closable: true,
  transparent: false,
  ...(isMac ? {} : { fullscreen: false }),
  kiosk: false,
  frame: true || isMac,
  autoHideMenuBar: true,
  resizable: true,
  alwaysOnTop: false,
  minimizable: true,
  maximizable: true,
  show: false,
  movable: true,
  opacity: 1.0,
  backgroundColor: "#f5f5f5",
  skipTaskbar: false,
  webPreferences: {
    preload: resolve(__dirname, "../bin/preload.cjs")
  }
}

/** 模态窗口默认配置 */
export const modal: Electron.BrowserWindowConstructorOptions = {
  modal: true,
  show: false,
  width: 100,
  height: 100,
  thickFrame: false,
  closable: false,
  transparent: true,
  frame: true || isMac,
  autoHideMenuBar: true,
  resizable: false,
  opacity: 0,
  skipTaskbar: true,
  alwaysOnTop: false,
  webPreferences: {
    webSecurity: false
  }
}
