import { app } from "electron"
import { BrowserWindow } from "electron"
import { Menu } from "electron"
import { screen } from "electron"
import { autoUpdater } from "electron-updater"

import setWinEvent from "./win.event"
import setWinMenu from "./win.menu"

/** 窗口类选项 */
interface WindowsOption {
  /** 主页地址 */
  indexURL: string
  /** 窗口选项 */
  win: Electron.BrowserWindowConstructorOptions | undefined
  /** 模态窗口选项 */
  modal: Electron.BrowserWindowConstructorOptions | undefined
}

class Windows {
  private isMac: boolean
  private indexURL: string | URL
  private workAreaSize: {
    width?: number
    height?: number
  }
  private win: Electron.BrowserWindowConstructorOptions | undefined
  private modal: Electron.BrowserWindowConstructorOptions | undefined
  /**
   * 窗口
   */
  constructor({ indexURL, win, modal }: WindowsOption) {
    this.workAreaSize = {} // 屏幕尺寸
    this.isMac = process.platform === "darwin"

    this.indexURL = indexURL // 文件地址不能带参和哈希路由
    this.win = win
    this.modal = modal
  }

  /**
   * 根据类型加载地址
   * 禁止内联跳转打开外链地址
   * @param win 窗口实例
   * @param path 跳转地址
   * @returns
   */
  loadSite(win: Electron.BrowserWindow, path: string | URL = this.indexURL) {
    const index = new URL(this.indexURL) // 配置地址
    const url = new URL(path) // 跳转地址

    String(path).startsWith("https://") || String(path).startsWith("http://")
      ? win.loadURL(String(url.origin != index.origin ? this.indexURL : path))
      : win.loadFile(String(this.indexURL), url.hash ? { hash: url.hash } : {})
  }

  /**
   * 窗口建制
   * @param win 窗口实例
   */
  setup(win: Electron.BrowserWindow) {
    // 窗口就绪
    win.once("ready-to-show", () => {
      win.show() // 显示窗口
      win.webContents.setZoomFactor(1) // 设置缩放;
      // 检查并通知是否存在新版本
      if (app.isPackaged) autoUpdater.checkForUpdatesAndNotify()
    })
    setWinEvent(win)
    setWinMenu(win)
  }

  /**
   * 记录屏幕尺寸
   */
  setupWorkAreaSize() {
    this.workAreaSize = screen.getPrimaryDisplay().workAreaSize
  }

  /**
   * 创建窗口
   * @param path 跳转地址
   * @returns
   */
  createWindow(path: string | URL = this.indexURL) {
    const win = new BrowserWindow({
      ...this.win,
      minWidth: parseInt(String((this.workAreaSize.width || 1280) / 2)),
      minHeight: parseInt(String((this.workAreaSize.height || 800) / 2))
    })
    if (win.isDestroyed()) return
    this.loadSite(win, path)

    // 打开外链时激活目标窗口
    win.webContents.on(
      "new-window",
      (event, url, frame, disposition, options) => {
        this.createWindow(url)
        event.preventDefault()
      }
    )

    return win
  }
}

export default Windows
