/**
 * 设置窗口事件监听
 * @param win 窗口实例
 */
export default function (win: Electron.BrowserWindow) {
  // 未响应
  win.on("unresponsive", () => {
    // window unresponsive
  })

  // 窗口关闭
  win.on("close", event => {
    // window close
  })

  // 窗口最大化
  win.on("maximize", () => {
    win.webContents.send("maximize", true)
  })

  // 窗口取消最大化
  win.on("unmaximize", () => {
    win.webContents.send("maximize", false)
  })
}
