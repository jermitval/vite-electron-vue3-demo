import { ipcMain, shell, BrowserWindow } from "electron"
import axios from "./axios"

export default function () {
  // 默认浏览器打开外链
  ipcMain.on("external-url", (event, url) => {
    shell.openExternal(url)
  })

  // 页面缩放
  ipcMain.on("zoom", (event, scale) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.webContents.setZoomFactor(Number(scale))
  })

  // 最小化
  ipcMain.on("minimize", event => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.minimize()
  })

  // 最大化
  ipcMain.on("maximize", event => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.maximize()
  })

  // 取消最大化
  ipcMain.on("unmaximize", event => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.unmaximize()
  })

  // 检查是否最大化
  ipcMain.on("isMaximized", (event, text) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.webContents.send("maximize", win.isMaximized())
  })

  // 窗口聚焦
  ipcMain.on("focus", (event, arg) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMinimized()) win.restore()
    win?.focus()
  })

  // 关闭窗口
  ipcMain.on("close", event => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.close()
  })

  // 切换开发者工具
  ipcMain.on("devtools", (event, allow) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && allow) win.webContents.toggleDevTools()
  })

  // 网络请求
  ipcMain.handle("axios", (event, arg) => axios(arg))
}
